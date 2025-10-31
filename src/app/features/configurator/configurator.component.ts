import { Component, computed, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorService } from '../../services/configurator.service';
import { Classification, Equipment, FunctionItem, OperationDetail, ProductData, ProductType, Range } from '../../models/line-work.interface';
import { Machine, OptionCategory, MachineOption } from '../../models/machine.interface';

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule
  ],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.css'
})
export class ConfiguratorComponent implements OnInit {

  // Referencia al contenedor scrollable
  @ViewChild('scrollContainer') private scrollContainer: ElementRef<HTMLDivElement> | undefined;
  // Referencia al div de información de la máquina
  @ViewChild('machineInfoDiv') private machineInfoDiv: ElementRef<HTMLDivElement> | undefined;

  // --- STATE MANAGEMENT ---
  private fullData = signal<ProductData[]>([]);
  selectionPath = signal<{ label: string, data: any }[]>([]);
  machineResult = signal<Machine | null>(null);
  isLoadingMachine = signal<boolean>(false);

  selectedOptions = signal<{
    aditional: Set<string>;
    optional: Set<string>;
    services: Set<string>;
  }>({
    aditional: new Set(),
    optional: new Set(),
    services: new Set()
  });

  // --- COMPUTED SIGNALS ---

  /**
   * Calcula todos los niveles visibles del mapa mental.
   * Cada nivel contiene sus opciones y sabe cuál está seleccionada.
   */
  computedLevels = computed(() => {
    let allLevels: { title: string, options: { label: string, data: any }[] }[] = [];
    
    // Nivel 0: Títulos principales
    allLevels.push({
      title: "Categoría Principal",
      options: this.fullData().map(item => ({ label: item.title, data: item }))
    });

    // Niveles siguientes basados en la selección
    let currentData: any = this.fullData(); 
    let currentTitle = "Categoría Principal";

    for (const [index, pathPart] of this.selectionPath().entries()) {
      const nextOptions = this.getNextOptions(pathPart.data);
      if (nextOptions.length > 0) {
        // Determinar el título del siguiente nivel
        const nextData = pathPart.data;
        if (nextData.classification) currentTitle = "Clasificación";
        else if (nextData.functions) currentTitle = nextData.function || "Funciones";
        else if (nextData.operation_details) currentTitle = "Detalles de Operación";
        else if (nextData.range) currentTitle = "Rango";
        else if (nextData.product_types) currentTitle = "Tipos de Producto";
        else if (nextData.equipment) currentTitle = "Equipos";
        else if (Array.isArray(nextData.type) && nextData.name) currentTitle = nextData.name;
        else if (Array.isArray(nextData.technology)) currentTitle = "Tecnología";
        else if (Array.isArray(nextData.application)) currentTitle = "Aplicación";
        else currentTitle = `Nivel ${index + 2}`;
        
        allLevels.push({
          title: currentTitle,
          options: nextOptions
        });
      }
      currentData = pathPart.data;
    }
    
    return allLevels;
  });

  /**
   * Determina si la selección ha llegado a un nodo final (sin más hijos).
   */
  isSelectionComplete = computed(() => {
    const path = this.selectionPath();
    if (path.length === 0) return false;
    
    const lastSelection = path[path.length - 1].data;
    return this.getNextOptions(lastSelection).length === 0;
  });

  totalPriceCOP = computed(() => {
    return this.calculateTotal('price_cop');
  });

  totalPriceUSD = computed(() => {
    return this.calculateTotal('price_usd');
  });
  

  // --- INYECCION DE SERVICIOS ---
  private configuratorService = inject(ConfiguratorService);

  constructor() {
    // Este effect reacciona a los cambios en isSelectionComplete
    effect(() => {
      if (this.isSelectionComplete()) {
        // La selección se ha completado, disparamos la búsqueda
        const path = this.selectionPath();
        const key = path.map(p => p.label).join('_');
        
        // Llamamos al método asíncrono
        this.loadMachine(key);
      } else {
        // La selección se reseteó o está en progreso, limpiamos resultados
        this.machineResult.set(null);
        this.isLoadingMachine.set(false);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.getMockData()
  }


  // --- PRIVATE HELPER METHODS ---

  /**
   * Determina la siguiente lista de opciones a partir de un objeto de datos.
   * (Sin cambios, esta lógica sigue siendo perfectamente válida y escalable)
   */
  private getNextOptions(item: any): { label: string, data: any }[] {
    if (item.classification) {
      return item.classification.map((c: Classification) => ({ label: c.main_type, data: c }));
    }
    if (item.functions) {
      return item.functions.map((f: FunctionItem) => ({ label: f.function, data: f }));
    }
    if (item.operation_details) {
      return item.operation_details.map((od: OperationDetail) => {
        const label = od.type || od.product_type || 'Detalle';
        return { label: label, data: od };
      });
    }
    if (item.equipment) {
      return item.equipment.map((e: Equipment) => ({ label: e.name, data: e }));
    }
    if (item.range && Array.isArray(item.range)) {
      return item.range.map((r: Range) => ({ label: r.system, data: r }));
    }
    if (item.product_types && Array.isArray(item.product_types)) {
        return item.product_types.map((pt: ProductType) => ({ label: pt.type, data: pt }));
    }
    if (Array.isArray(item.technology)) {
      return item.technology.map((t: string) => ({ label: t, data: t }));
    }
    if (Array.isArray(item.application)) {
      return item.application.map((a: string) => ({ label: a, data: a }));
    }
    if (Array.isArray(item.type)) {
      return item.type.map((t: string) => ({ label: t, data: t }));
    }

    return [];
  }
  
  // --- PUBLIC EVENT HANDLERS ---

  /**
   * Maneja la selección de cualquier nodo en cualquier nivel.
   * Recorta el historial de selección al nivel del clic y añade la nueva selección.
   */
  handleSelection(option: { label: string, data: any }, levelIndex: number): void {
    this.selectionPath.update(currentPath => {
      // Si se hace clic en un nodo ya seleccionado, no se recorta el path
      if (currentPath[levelIndex]?.label === option.label) {
        return currentPath;
      }
      // Recorta el path hasta el nivel del padre y añade la nueva selección
      const newPath = currentPath.slice(0, levelIndex);
      newPath.push(option);
      return newPath;
    });

    // Auto-scroll al final
    this.scrollToEnd();
  }

  /**
   * Reinicia la selección.
   */
  reset(): void {
    this.selectionPath.set([]);
    // (NUEVO) Auto-scroll al inicio al resetear
    this.scrollToStart();
  }


  /**
   * Hace scroll horizontal al final del contenedor.
   */
  private scrollToEnd(): void {
    // Usamos setTimeout para esperar a que el DOM se actualice con el nuevo nivel
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        // Forzamos el scroll al final usando scrollTo con behavior smooth
        el.scrollTo({
          left: el.scrollWidth - el.clientWidth,
          behavior: 'smooth'
        });
      }
    }, 20); // Aumentamos el tiempo para asegurar que el DOM esté actualizado
  }

  /**
   * Hace scroll horizontal al inicio del contenedor.
   */
  private scrollToStart(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scroll({
          left: 0, // Scroll al inicio
          behavior: 'smooth'
        });
      }
    }, 0);
  }

  /**
   * Hace scroll al div de información de la máquina.
   */
  private scrollToMachineInfo(): void {
    setTimeout(() => {
      if (this.machineInfoDiv) {
        this.machineInfoDiv.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 200); // Pequeño delay para asegurar que el DOM esté actualizado
  }

  // --- MACHINE LOADING LOGIC ---
  private loadMachine(key: string): void {
    this.isLoadingMachine.set(true);
    this.machineResult.set(null); // Limpiamos resultado anterior

    // Llamamos a la simulación de API
    const result = this.configuratorService.getMachineByKey(key);

    // Actualizamos los signals con el resultado
    this.machineResult.set(result);
    this.isLoadingMachine.set(false);

    // Auto-scroll al div de información de la máquina
    this.scrollToMachineInfo();
  }

  /**
   * Activa o desactiva una opción individual.
   */
  toggleOption(category: OptionCategory, optionName: string) {
    this.selectedOptions.update(current => {
      // Crea un nuevo Set basado en el Set anterior para la categoría
      const newSet = new Set(current[category]);
      
      if (newSet.has(optionName)) {
        newSet.delete(optionName);
      } else {
        newSet.add(optionName);
      }

      // Devuelve un objeto de estado completamente nuevo
      return {
        ...current,
        [category]: newSet
      };
    });
  }

  /**
   * Activa o desactiva todas las opciones de una categoría.
   */
  toggleAll(category: OptionCategory, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const machine = this.machineResult();
    if (!machine) return;

    let categoryKey: 'aditional_equipment' | 'optional_equipment' | 'services_documentation';
    if (category === 'aditional') categoryKey = 'aditional_equipment';
    else if (category === 'optional') categoryKey = 'optional_equipment';
    else categoryKey = 'services_documentation'; // 'services'

    const allNames = machine[categoryKey].map(item => item.name);

    this.selectedOptions.update(current => {
      const newSet = isChecked ? new Set(allNames) : new Set();
      
      // Devuelve un objeto de estado completamente nuevo
      return {
        ...current,
        [category]: newSet
      };
    });
  }

  /**
   * (NUEVO)
   * Formatea un número como moneda COP o USD.
   */
  formatPrice(price: number, currency: 'COP' | 'USD'): string {
    const formatter = new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
    return formatter.format(price);
  }

  /**
   * Lógica de cálculo de precio total reutilizable.
   */
  private calculateTotal(currency: 'price_cop' | 'price_usd'): number {
    const machine = this.machineResult();
    if (!machine) return 0;

    let total = machine[currency];
    const selections = this.selectedOptions();

    // Helper function para sumar una categoría
    const sumCategory = (category: MachineOption[], selectedNames: Set<string>) => {
      return category
        .filter(item => selectedNames.has(item.name))
        .reduce((sum, item) => sum + item[currency], 0);
    };

    total += sumCategory(machine.aditional_equipment, selections.aditional);
    total += sumCategory(machine.optional_equipment, selections.optional);
    total += sumCategory(machine.services_documentation, selections.services);

    return total;
  }

  // --- MOCK DATA ---
  private getMockData(): void {
    const data = this.configuratorService.getLineWorkConsolidate();
    console.log(data);
    this.fullData.set(data);
  }

}


