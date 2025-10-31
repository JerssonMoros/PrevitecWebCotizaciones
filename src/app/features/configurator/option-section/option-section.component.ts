import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineOption, OptionCategory } from '../../../models/machine.interface';
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
  @Input() selectedOptionNames: Set<string> = new Set();
  @Input() category: OptionCategory = 'aditional';

  @Output() optionToggled = new EventEmitter<{ category: OptionCategory, optionName: string }>();
  @Output() allToggled = new EventEmitter<{ category: OptionCategory, event: Event }>();

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
    return this.selectedOptionNames.size === this.options.length;
  }
}