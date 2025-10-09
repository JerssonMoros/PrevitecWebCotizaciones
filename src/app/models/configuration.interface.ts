import { MachineOption } from './machine-option.interface';

export interface Configuration {
  selectedOptions: MachineOption[];
  totalCost: number;
}