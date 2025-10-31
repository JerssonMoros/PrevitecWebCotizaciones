export interface OperationDetail {
  type?: string;
  subtype?: string | null;
  product_type?: string;
  range?: Range[] | null;
  technology?: string[];
  product_types?: ProductType[];
}

export interface Range {
  system: string;
  technology: string[];
}

export interface ProductType {
  type: string;
  application: string[];
}

export interface FunctionItem {
  function: string;
  operation_details: OperationDetail[];
}

export interface Classification {
  main_type: string;
  functions: FunctionItem[];
}

export interface Equipment {
  name: string;
  type: string[] | null;
}

export interface ProductData {
  id: number;
  title: string;
  classification?: Classification[];
  equipment?: Equipment[];
}