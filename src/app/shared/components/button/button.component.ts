import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="onClick()">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      @apply px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
    }
    .btn-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
    }
    .btn-secondary {
      @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500;
    }
    .btn:disabled {
      @apply opacity-50 cursor-not-allowed;
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;

  @Output() click = new EventEmitter<void>();

  get buttonClasses(): string {
    return `btn btn-${this.variant} ${this.disabled ? 'btn:disabled' : ''}`;
  }

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}