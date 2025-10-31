import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="flex justify-center items-center" [class]="containerClasses">
      <div class="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" [class]="spinnerClasses"></div>
      @if (message) {
        <span class="ml-2 text-gray-600">{{ message }}</span>
      }
    </div>
  `,
  styles: [`
    .loader-small { width: 1rem; height: 1rem; }
    .loader-medium { width: 2rem; height: 2rem; }
    .loader-large { width: 3rem; height: 3rem; }
  `]
})
export class LoaderComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message = '';
  @Input() fullScreen = false;

  get containerClasses(): string {
    return this.fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : '';
  }

  get spinnerClasses(): string {
    return `loader-${this.size}`;
  }
}