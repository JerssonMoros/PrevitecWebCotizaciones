import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineOption, OptionCategory, CategoryConfig } from '../../../models/machine.interface';
import { PriceCalculationService } from '../../../services/price-calculation/price-calculation.service';

@Component({
  selector: 'app-option-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './option-section.component.html',
  styleUrl: './option-section.component.css'
})
export class OptionSectionComponent {

  @Input() title: string = '';
  @Input() options: MachineOption[] = [];
  @Input() selectedOptionNames: Set<string> | Map<string, number> = new Set();
  @Input() selectedAditionalQuantities: Map<string, number> = new Map();
  @Input() category: OptionCategory = 'aditional';
  @Input() categoryConfig: CategoryConfig = { category: 'aditional', hasQuantity: false, hasSelectAll: true };

  @Output() optionToggled = new EventEmitter<{ category: OptionCategory, optionName: string }>();
  @Output() allToggled = new EventEmitter<{ category: OptionCategory, event: Event }>();
  @Output() incrementAditional = new EventEmitter<string>();
  @Output() decrementAditional = new EventEmitter<string>();

  private priceService = inject(PriceCalculationService);

  /**
   * Maneja el cambio de una opción individual.
   */
  onOptionChange(optionName: string): void {
    this.optionToggled.emit({ category: this.category, optionName });
  }

  /**
   * Maneja el cambio del checkbox "Seleccionar todo".
   */
  onAllChange(event: Event): void {
    this.allToggled.emit({ category: this.category, event });
  }

  /**
   * Formatea un precio como moneda.
   */
  formatPrice(price: number, currency: 'COP' | 'USD'): string {
    return this.priceService.formatPrice(price, currency);
  }

  /**
   * Verifica si todas las opciones están seleccionadas.
   */
  get isAllSelected(): boolean {
    if (this.selectedOptionNames instanceof Set) {
      return this.selectedOptionNames.size === this.options.length;
    } else {
      // Para Map, verificar si todas las opciones tienen cantidad > 0
      return this.options.every(option => (this.selectedOptionNames as Map<string, number>).get(option.name)! > 0);
    }
  }

  /**
   * Obtiene la cantidad seleccionada para una opción adicional.
   */
  getAditionalQuantity(optionName: string): number {
    return this.selectedAditionalQuantities.get(optionName) || 0;
  }

  /**
   * Maneja el incremento de cantidad para adicionales.
   */
  onIncrement(optionName: string): void {
    this.incrementAditional.emit(optionName);
  }

  /**
   * Maneja el decremento de cantidad para adicionales.
   */
  onDecrement(optionName: string): void {
    this.decrementAditional.emit(optionName);
  }
}