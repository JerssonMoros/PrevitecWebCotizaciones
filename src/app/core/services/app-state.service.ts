import { Injectable, signal, computed } from '@angular/core';

// Interfaces for global state
export interface AppConfig {
  theme: 'light' | 'dark';
  language: string;
  version: string;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Global app configuration
  private _appConfig = signal<AppConfig>({
    theme: 'light',
    language: 'es',
    version: '1.0.0'
  });

  // Notification state
  private _notification = signal<NotificationState>({
    message: '',
    type: 'info',
    visible: false
  });

  // Loading state
  private _isLoading = signal<boolean>(false);

  // Computed signals
  appConfig = computed(() => this._appConfig());
  notification = computed(() => this._notification());
  isLoading = computed(() => this._isLoading());

  // Methods to update state
  updateAppConfig(config: Partial<AppConfig>): void {
    this._appConfig.update(current => ({ ...current, ...config }));
  }

  showNotification(message: string, type: NotificationState['type'] = 'info'): void {
    this._notification.set({ message, type, visible: true });
    // Auto-hide after 5 seconds
    setTimeout(() => this.hideNotification(), 5000);
  }

  hideNotification(): void {
    this._notification.update(current => ({ ...current, visible: false }));
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // TODO: Add more global state as needed (e.g., user preferences, app settings)
}