import { Injectable } from '@angular/core';
import { Machine, MachineOption } from '../../models/machine.interface';

@Injectable({
  providedIn: 'root'
})
export class PriceCalculationService {

  /**
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
   * Calcula el precio total para una moneda específica.
   */
  calculateTotal(machine: Machine, selectedOptions: { aditional: Map<string, number>; optional: Set<string>; services: Set<string> }, currency: 'price_cop' | 'price_usd'): number {
    let total = machine[currency];

    // Helper function para sumar una categoría con cantidades
    const sumCategoryWithQuantity = (category: MachineOption[], selectedQuantities: Map<string, number>) => {
      return category
        .filter(item => selectedQuantities.has(item.name))
        .reduce((sum, item) => sum + (item[currency] * selectedQuantities.get(item.name)!), 0);
    };

    // Helper function para sumar una categoría sin cantidades
    const sumCategory = (category: MachineOption[], selectedNames: Set<string>) => {
      return category
        .filter(item => selectedNames.has(item.name))
        .reduce((sum, item) => sum + item[currency], 0);
    };

    total += sumCategoryWithQuantity(machine.aditional_equipment, selectedOptions.aditional);
    total += sumCategory(machine.optional_equipment, selectedOptions.optional);
    total += sumCategory(machine.services_documentation, selectedOptions.services);

    return total;
  }

  /**
   * Calcula el precio total en COP.
   */
  calculateTotalCOP(machine: Machine, selectedOptions: { aditional: Map<string, number>; optional: Set<string>; services: Set<string> }): number {
    return this.calculateTotal(machine, selectedOptions, 'price_cop');
  }

  /**
   * Calcula el precio total en USD.
   */
  calculateTotalUSD(machine: Machine, selectedOptions: { aditional: Map<string, number>; optional: Set<string>; services: Set<string> }): number {
    return this.calculateTotal(machine, selectedOptions, 'price_usd');
  }
}