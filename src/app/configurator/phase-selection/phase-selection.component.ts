import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Phase } from '../../models/phase.interface';
import { MachineOption } from '../../models/machine-option.interface';

@Component({
  selector: 'app-phase-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phase-selection.component.html',
  styleUrls: ['./phase-selection.component.css']
})
export class PhaseSelectionComponent {
  @Input() currentPhase: Phase | null = null;
  @Input() currentOptions: MachineOption[] = [];
  @Input() selectedOptions: MachineOption[] = [];
  @Output() optionSelected = new EventEmitter<MachineOption>();

  isSelected(option: MachineOption): boolean {
    return this.selectedOptions.some(sel => sel.id === option.id);
  }

  onOptionClick(option: MachineOption): void {
    this.optionSelected.emit(option);
  }
}
