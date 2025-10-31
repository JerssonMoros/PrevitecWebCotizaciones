import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-footer.component.html',
  styleUrls: ['./navigation-footer.component.css']
})
export class NavigationFooterComponent {
  @Input() currentPhaseIndex: number = 0;
  @Input() totalPhases: number = 0;
  @Output() previousClicked = new EventEmitter<void>();
  @Output() nextClicked = new EventEmitter<void>();
  @Output() resetClicked = new EventEmitter<void>();

  onPrevious(): void {
    this.previousClicked.emit();
  }

  onNext(): void {
    this.nextClicked.emit();
  }

  onReset(): void {
    this.resetClicked.emit();
  }
}
