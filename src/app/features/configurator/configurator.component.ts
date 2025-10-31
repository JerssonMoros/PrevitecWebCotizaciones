import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorStateService } from '../../services/configurator-state/configurator-state.service';
import { SelectionTreeComponent } from './selection-tree/selection-tree.component';
import { MachineConfiguratorComponent } from './machine-configurator/machine-configurator.component';

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [
    CommonModule,
    SelectionTreeComponent,
    MachineConfiguratorComponent
  ],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.css'
})
export class ConfiguratorComponent implements OnInit {

  // Inyección del servicio de estado
  private stateService = inject(ConfiguratorStateService);

  // Exposición de señales computadas para el template
  isSelectionComplete = this.stateService.isSelectionComplete;

  constructor() {
    // Efecto para cargar máquina cuando la selección se complete
    effect(() => {
      if (this.isSelectionComplete()) {
        this.stateService.loadMachine();
      }
    });
  }

  ngOnInit(): void {
    this.stateService.initializeData();
  }

  /**
   * Maneja el evento de reset desde los componentes hijos.
   */
  onReset(): void {
    this.stateService.reset();
  }
}


