import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Phase } from '../../models/phase.interface';

@Component({
  selector: 'app-breadcrumb-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrls: ['./breadcrumb-navigation.component.css']
})
export class BreadcrumbNavigationComponent {
  @Input() phases: Phase[] = [];
  @Input() currentPhaseIndex: number = 0;
  @Output() phaseSelected = new EventEmitter<number>();

  onPhaseClick(phaseIndex: number): void {
    if (phaseIndex <= this.currentPhaseIndex) {
      this.phaseSelected.emit(phaseIndex);
    }
  }
}
