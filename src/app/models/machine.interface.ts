export interface Machine {
  path: string;
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price_cop: number;
  price_usd: number;
  aditional_equipment: AditionalEquipment[];
  optional_equipment: OptionalEquipment[];
  services_documentation: ServicesDocumentation[];
}

export interface AditionalEquipment {
  name: string;
  description: string;
  price_cop: number;
  price_usd: number;
}

export interface OptionalEquipment {
  name: string;
  description: string;
  price_cop: number;
  price_usd: number;
}

export interface ServicesDocumentation {
  name: string;
  description: string;
  price_cop: number;
  price_usd: number;
}

export interface MachineOption {
  name: string;
  description: string;
  price_cop: number;
  price_usd: number;
}
export type OptionCategory = 'aditional' | 'optional' | 'services';

export interface CategoryConfig {
  category: OptionCategory;
  hasQuantity: boolean;
  hasSelectAll: boolean;
}