import { Injectable } from '@angular/core';
import { MOCK_MACHINES_CONSOLIDATED } from '../data/mock-data';
import { ProductData } from '../models/line-work.interface';
import { Observable } from 'rxjs';
import type { Machine } from '../models/machine.interface';
import { MOCK_MACHINES } from '../data/machine-mock-data';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {

  constructor() { }

  getLineWorkConsolidate(): ProductData[] {
    return MOCK_MACHINES_CONSOLIDATED
  }

  getMachineByKey(key: string): Machine | null {
    console.log(key);
    const machine = MOCK_MACHINES.find(m => m.path === key);
    console.log(machine);
    return machine || null;
  }
    
      
}
