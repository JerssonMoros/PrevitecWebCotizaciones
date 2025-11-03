import { Component, ElementRef, inject, Output, EventEmitter, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorStateService } from '../../../services/configurator-state/configurator-state.service';
import { PriceCalculationService } from '../../../services/price-calculation/price-calculation.service';
import { OptionSectionComponent } from '../option-section/option-section.component';
import { Machine, OptionCategory, CategoryConfig } from '../../../models/machine.interface';

@Component({
  selector: 'app-machine-configurator',
  standalone: true,
  imports: [CommonModule, OptionSectionComponent],
  templateUrl: './machine-configurator.component.html',
  styleUrl: './machine-configurator.component.css'
})
export class MachineConfiguratorComponent {

  // Referencia al div de información de la máquina
  @ViewChild('machineInfoDiv') private machineInfoDiv: ElementRef<HTMLDivElement> | undefined;

  // Outputs para comunicar con el componente padre
  @Output() machineLoaded = new EventEmitter<Machine | null>();

  // Inyección de servicios
  private stateService = inject(ConfiguratorStateService);
  private priceService = inject(PriceCalculationService);

  // Exposición de señales computadas del servicio
  categoryConfigs = this.stateService.categoryConfigs;

  // Exposición de señales computadas del servicio
  machineResult = this.stateService.machineResult;
  isLoadingMachine = this.stateService.isLoadingMachine;
  selectedOptions = this.stateService.selectedOptions;
  totalPriceCOP = this.stateService.totalPriceCOP;
  totalPriceUSD = this.stateService.totalPriceUSD;

  constructor() {
    // Efecto para manejar el scroll automático cuando se carga una máquina
    effect(() => {
      if (this.machineResult()) {
        this.scrollToMachineInfo();
        this.machineLoaded.emit(this.machineResult());
      }
    });
  }

  /**
   * Activa o desactiva una opción individual.
   */
  toggleOption(category: OptionCategory, optionName: string): void {
    this.stateService.toggleOption(category, optionName);
  }

  /**
   * Activa o desactiva todas las opciones de una categoría.
   */
  toggleAll(category: OptionCategory, event: Event): void {
    this.stateService.toggleAll(category, event);
  }

  /**
   * Incrementa la cantidad de una opción adicional.
   */
  incrementAditional(optionName: string): void {
    this.stateService.incrementAditional(optionName);
  }

  /**
   * Decrementa la cantidad de una opción adicional.
   */
  decrementAditional(optionName: string): void {
    this.stateService.decrementAditional(optionName);
  }

  /**
   * Obtiene la configuración de una categoría.
   */
  getCategoryConfig(category: OptionCategory): CategoryConfig {
    const config = this.categoryConfigs().get(category) || { hasQuantity: false, hasSelectAll: true };
    return { category, ...config };
  }

  /**
   * Formatea un precio como moneda.
   */
  formatPrice(price: number, currency: 'COP' | 'USD'): string {
    return this.priceService.formatPrice(price, currency);
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
}