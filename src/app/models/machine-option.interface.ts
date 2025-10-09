export interface MachineOption {
  id: string;
  name: string;
  cost: number;
  compatibleWith: string[]; // IDs of compatible previous options
  isOptional: boolean;
}