import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Configuration } from '../models/configuration.interface';
import { MachineOption } from '../models/machine-option.interface';
import { Phase } from '../models/phase.interface';
import { MOCK_PHASES } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {
  private configuration$ = new BehaviorSubject<Configuration>({ selectedOptions: [], totalCost: 0 });
  private phases: Phase[] = MOCK_PHASES;

  constructor() { }

  getConfiguration(): Observable<Configuration> {
    return this.configuration$.asObservable();
  }

  selectOption(option: MachineOption): void {
    const current = this.configuration$.value;
    const isAlreadySelected = current.selectedOptions.some(opt => opt.id === option.id);

    if (isAlreadySelected) {
      // Deselect if optional
      if (option.isOptional) {
        const newOptions = current.selectedOptions.filter(opt => opt.id !== option.id);
        this.updateConfiguration(newOptions);
      }
    } else {
      // Select
      const newOptions = [...current.selectedOptions, option];
      this.updateConfiguration(newOptions);
    }
  }

  private updateConfiguration(options: MachineOption[]): void {
    const totalCost = options.reduce((sum, opt) => sum + opt.cost, 0);
    this.configuration$.next({ selectedOptions: options, totalCost });
  }

  getAvailableOptions(phaseId: string): MachineOption[] {
    const phase = this.phases.find(p => p.id === phaseId);
    if (!phase) return [];

    const currentOptions = this.configuration$.value.selectedOptions;
    const previousPhaseIndex = this.phases.findIndex(p => p.id === phaseId) - 1;

    if (previousPhaseIndex < 0) {
      // First phase, all options
      return phase.options.filter(opt => !opt.isOptional);
    }

    const previousSelected = currentOptions.filter(opt => {
      const prevPhase = this.phases[previousPhaseIndex];
      return prevPhase.options.some(pOpt => pOpt.id === opt.id);
    });

    return phase.options.filter(opt =>
      opt.compatibleWith.some(comp => previousSelected.some(sel => sel.id === comp))
    );
  }

  getSuggestions(): MachineOption[] {
    const current = this.configuration$.value;
    const selectedIds = current.selectedOptions.map(opt => opt.id);

    // Simple suggestion: optional parts compatible with selected
    return this.phases.flatMap(phase =>
      phase.options.filter(opt =>
        opt.isOptional &&
        opt.compatibleWith.some(comp => selectedIds.includes(comp)) &&
        !selectedIds.includes(opt.id)
      )
    );
  }

  reset(): void {
    this.configuration$.next({ selectedOptions: [], totalCost: 0 });
  }

  getPhases(): Phase[] {
    return this.phases;
  }
}
