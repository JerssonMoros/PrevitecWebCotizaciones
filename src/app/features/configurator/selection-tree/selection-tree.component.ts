import { Component, ElementRef, inject, Input, Output, EventEmitter, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorStateService } from '../../../services/configurator-state/configurator-state.service';

@Component({
  selector: 'app-selection-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-tree.component.html',
  styleUrl: './selection-tree.component.css'
})
export class SelectionTreeComponent {

  // Referencia al contenedor scrollable
  @ViewChild('scrollContainer') private scrollContainer: ElementRef<HTMLDivElement> | undefined;

  // Outputs para comunicar con el componente padre
  @Output() selectionChanged = new EventEmitter<{ label: string, data: any }>();
  @Output() resetRequested = new EventEmitter<void>();

  // Inyección del servicio de estado
  private stateService = inject(ConfiguratorStateService);

  // Exposición de señales computadas del servicio
  computedLevels = this.stateService.computedLevels;
  selectionPath = this.stateService.selectionPath;
  isSelectionComplete = this.stateService.isSelectionComplete;

  constructor() {
    // Efecto para manejar el scroll automático cuando cambia la selección
    effect(() => {
      if (this.selectionPath().length > 0) {
        this.scrollToEnd();
      }
    });
  }

  /**
   * Maneja la selección de cualquier nodo en cualquier nivel.
   */
  handleSelection(option: { label: string, data: any }, levelIndex: number): void {
    this.stateService.handleSelection(option, levelIndex);
    this.selectionChanged.emit(option);
  }

  /**
   * Reinicia la selección.
   */
  reset(): void {
    this.stateService.reset();
    this.scrollToStart();
    this.resetRequested.emit();
  }

  /**
   * Hace scroll horizontal al final del contenedor.
   */
  private scrollToEnd(): void {
    // Usamos setTimeout para esperar a que el DOM se actualice con el nuevo nivel
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        // Forzamos el scroll al final usando scrollTo con behavior smooth
        el.scrollTo({
          left: el.scrollWidth - el.clientWidth,
          behavior: 'smooth'
        });
      }
    }, 20); // Aumentamos el tiempo para asegurar que el DOM esté actualizado
  }

  /**
   * Hace scroll horizontal al inicio del contenedor.
   */
  private scrollToStart(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scroll({
          left: 0, // Scroll al inicio
          behavior: 'smooth'
        });
      }
    }, 0);
  }
}