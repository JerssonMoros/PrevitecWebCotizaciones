import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfiguratorService } from '../services/configurator.service';
import { Configuration } from '../models/configuration.interface';
import { MachineOption } from '../models/machine-option.interface';
import { Phase } from '../models/phase.interface';

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './configurator.component.html'
})
export class ConfiguratorComponent implements OnInit {
  phases: Phase[] = [];
  configuration$!: Observable<Configuration>;
  currentConfig: Configuration = { selectedOptions: [], totalCost: 0 };
  currentPhaseIndex = 0;
  currentOptions: MachineOption[] = [];
  suggestions: MachineOption[] = [];

  constructor(private configuratorService: ConfiguratorService) {}

  ngOnInit(): void {
    this.phases = this.configuratorService.getPhases();
    this.configuration$ = this.configuratorService.getConfiguration();
    this.configuration$.subscribe(config => {
      this.currentConfig = config;
      this.updateCurrentOptions();
      this.suggestions = this.configuratorService.getSuggestions();
    });
  }

  private updateCurrentOptions(): void {
    if (this.currentPhaseIndex < this.phases.length) {
      this.currentOptions = this.configuratorService.getAvailableOptions(this.phases[this.currentPhaseIndex].id);
    }
  }

  selectOption(option: MachineOption): void {
    this.configuratorService.selectOption(option);
  }

  nextPhase(): void {
    if (this.currentPhaseIndex < this.phases.length - 1) {
      this.currentPhaseIndex++;
      this.updateCurrentOptions();
    }
  }

  prevPhase(): void {
    if (this.currentPhaseIndex > 0) {
      this.currentPhaseIndex--;
      this.updateCurrentOptions();
    }
  }

  reset(): void {
    this.configuratorService.reset();
    this.currentPhaseIndex = 0;
    this.updateCurrentOptions();
  }

  isSelected(option: MachineOption): boolean {
    // Check if the option is selected in the current configuration
    return this.currentConfig.selectedOptions.some((sel: MachineOption) => sel.id === option.id);
  }

  getProgress(): number {
    return ((this.currentPhaseIndex + 1) / this.phases.length) * 100;
  }
}
