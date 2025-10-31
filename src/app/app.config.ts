import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

// Interceptors
// import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

// Guards
// import { AuthGuard } from './core/guards/auth.guard';

// Services
import { AppStateService } from './core/services/app-state.service';
// import { AuthService } from './core/services/auth.service';
import { HttpService } from './core/services/http.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // Services
    // AuthService,
    HttpService,
    AppStateService,
    // Guards
    // AuthGuard,
    // Interceptors
    // {
    //   provide: 'HTTP_INTERCEPTORS',
    //   useClass: AuthInterceptor,
    //   multi: true
    // },
    {
      provide: 'HTTP_INTERCEPTORS',
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
};
