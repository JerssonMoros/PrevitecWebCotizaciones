import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineOption } from '../../models/machine-option.interface';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent {
  @Input() suggestions: MachineOption[] = [];
  @Output() suggestionSelected = new EventEmitter<MachineOption>();

  onSuggestionClick(suggestion: MachineOption): void {
    this.suggestionSelected.emit(suggestion);
  }
}
