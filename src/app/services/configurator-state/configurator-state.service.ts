import { Injectable, computed, signal } from '@angular/core';
import { ProductData } from '../../models/line-work.interface';
import { Machine } from '../../models/machine.interface';
import { ConfiguratorService } from '../configurator.service';
import { PriceCalculationService } from '../price-calculation/price-calculation.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorStateService {

  // --- STATE MANAGEMENT ---
  private fullData = signal<ProductData[]>([]);
  selectionPath = signal<{ label: string, data: any }[]>([]);
  machineResult = signal<Machine | null>(null);
  isLoadingMachine = signal<boolean>(false);

  selectedOptions = signal<{
    aditional: Map<string, number>;
    optional: Set<string>;
    services: Set<string>;
  }>({
    aditional: new Map(),
    optional: new Set(),
    services: new Set()
  });

  // Configuración de categorías
  categoryConfigs = signal<Map<string, { hasQuantity: boolean; hasSelectAll: boolean }>>(new Map([
    ['aditional', { hasQuantity: true, hasSelectAll: false }],
    ['optional', { hasQuantity: false, hasSelectAll: true }],
    ['services', { hasQuantity: false, hasSelectAll: true }]
  ]));

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
    const machine = this.machineResult();
    if (!machine) return 0;
    return this.priceCalculationService.calculateTotalCOP(machine, this.selectedOptions());
  });

  totalPriceUSD = computed(() => {
    const machine = this.machineResult();
    if (!machine) return 0;
    return this.priceCalculationService.calculateTotalUSD(machine, this.selectedOptions());
  });

  /**
   * Obtiene la cantidad seleccionada para una opción adicional.
   */
  getAditionalQuantity(optionName: string): number {
    return this.selectedOptions().aditional.get(optionName) || 0;
  }

  /**
   * Obtiene la configuración de una categoría.
   */
  getCategoryConfig(category: string): { hasQuantity: boolean; hasSelectAll: boolean } {
    return this.categoryConfigs().get(category) || { hasQuantity: false, hasSelectAll: true };
  }

  /**
   * Establece la configuración de una categoría.
   */
  setCategoryConfig(category: string, config: { hasQuantity: boolean; hasSelectAll: boolean }): void {
    this.categoryConfigs.update(configs => {
      const newConfigs = new Map(configs);
      newConfigs.set(category, config);
      return newConfigs;
    });
  }

  constructor(
    private configuratorService: ConfiguratorService,
    private priceCalculationService: PriceCalculationService
  ) {}

  // --- PRIVATE HELPER METHODS ---

  /**
   * Determina la siguiente lista de opciones a partir de un objeto de datos.
   */
  private getNextOptions(item: any): { label: string, data: any }[] {
    if (item.classification) {
      return item.classification.map((c: any) => ({ label: c.main_type, data: c }));
    }
    if (item.functions) {
      return item.functions.map((f: any) => ({ label: f.function, data: f }));
    }
    if (item.operation_details) {
      return item.operation_details.map((od: any) => {
        const label = od.type || od.product_type || 'Detalle';
        return { label: label, data: od };
      });
    }
    if (item.equipment) {
      return item.equipment.map((e: any) => ({ label: e.name, data: e }));
    }
    if (item.range && Array.isArray(item.range)) {
      return item.range.map((r: any) => ({ label: r.system, data: r }));
    }
    if (item.product_types && Array.isArray(item.product_types)) {
        return item.product_types.map((pt: any) => ({ label: pt.type, data: pt }));
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

  // --- PUBLIC METHODS ---

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
  }

  /**
   * Reinicia la selección.
   */
  reset(): void {
    this.selectionPath.set([]);
    this.machineResult.set(null);
    this.isLoadingMachine.set(false);
    this.selectedOptions.set({
      aditional: new Map(),
      optional: new Set(),
      services: new Set()
    });
  }

  /**
   * Activa o desactiva una opción individual.
   */
  toggleOption(category: 'aditional' | 'optional' | 'services', optionName: string) {
    this.selectedOptions.update(current => {
      if (category === 'aditional') {
        // Para adicionales, manejamos cantidades
        const newMap = new Map(current.aditional);
        const currentQty = newMap.get(optionName) || 0;
        if (currentQty > 0) {
          newMap.delete(optionName);
        } else {
          newMap.set(optionName, 1);
        }
        return {
          ...current,
          aditional: newMap
        };
      } else {
        // Para opcionales y servicios, comportamiento anterior
        const newSet = new Set(current[category]);
        if (newSet.has(optionName)) {
          newSet.delete(optionName);
        } else {
          newSet.add(optionName);
        }
        return {
          ...current,
          [category]: newSet
        };
      }
    });
  }

  /**
   * Incrementa la cantidad de una opción adicional.
   */
  incrementAditional(optionName: string) {
    this.selectedOptions.update(current => {
      const newMap = new Map(current.aditional);
      const currentQty = newMap.get(optionName) || 0;
      newMap.set(optionName, currentQty + 1);
      return {
        ...current,
        aditional: newMap
      };
    });
  }

  /**
   * Decrementa la cantidad de una opción adicional.
   */
  decrementAditional(optionName: string) {
    this.selectedOptions.update(current => {
      const newMap = new Map(current.aditional);
      const currentQty = newMap.get(optionName) || 0;
      if (currentQty > 1) {
        newMap.set(optionName, currentQty - 1);
      } else {
        newMap.delete(optionName);
      }
      return {
        ...current,
        aditional: newMap
      };
    });
  }

  /**
   * Activa o desactiva todas las opciones de una categoría.
   */
  toggleAll(category: 'aditional' | 'optional' | 'services', event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const machine = this.machineResult();
    if (!machine) return;

    let categoryKey: 'aditional_equipment' | 'optional_equipment' | 'services_documentation';
    if (category === 'aditional') categoryKey = 'aditional_equipment';
    else if (category === 'optional') categoryKey = 'optional_equipment';
    else categoryKey = 'services_documentation'; // 'services'

    const allNames = machine[categoryKey].map(item => item.name);

    this.selectedOptions.update(current => {
      if (category === 'aditional') {
        // Para adicionales, seleccionar todo establece cantidad 1 para todos
        const newMap = new Map(current.aditional);
        if (isChecked) {
          allNames.forEach(name => {
            if (!newMap.has(name)) {
              newMap.set(name, 1);
            }
          });
        } else {
          allNames.forEach(name => newMap.delete(name));
        }
        return {
          ...current,
          aditional: newMap
        };
      } else {
        const newSet = isChecked ? new Set(allNames) : new Set();
        return {
          ...current,
          [category]: newSet
        };
      }
    });
  }

  /**
   * Carga la máquina basada en la selección completa.
   */
  loadMachine(): void {
    const path = this.selectionPath();
    const key = path.map(p => p.label).join('_');

    this.isLoadingMachine.set(true);
    this.machineResult.set(null); // Limpiamos resultado anterior

    // Llamamos a la simulación de API
    const result = this.configuratorService.getMachineByKey(key);

    // Actualizamos los signals con el resultado
    this.machineResult.set(result);
    this.isLoadingMachine.set(false);
  }

  /**
   * Inicializa los datos del configurador.
   */
  initializeData(): void {
    const data = this.configuratorService.getLineWorkConsolidate();
    this.fullData.set(data);
  }
}