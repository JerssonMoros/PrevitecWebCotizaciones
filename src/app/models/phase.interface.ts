import { MachineOption } from './machine-option.interface';

export interface Phase {
  id: string;
  name: string;
  options: MachineOption[];
}