import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineOption } from '../../models/machine-option.interface';

@Component({
  selector: 'app-selection-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-summary.component.html',
  styleUrls: ['./selection-summary.component.css']
})
export class SelectionSummaryComponent {
  @Input() selectedOptions: MachineOption[] = [];
  @Input() totalCost: number = 0;
}
