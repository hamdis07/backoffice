import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './services/auth.interceptor'; // Import your interceptor
import { routes } from './app.routes'; // Import your routes
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { BaseChartDirective } from 'ng2-charts'; // Import ChartsModule here

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()), // Enable fetch API
    importProvidersFrom(ReactiveFormsModule, BaseChartDirective), // Provide ReactiveFormsModule and ChartsModule here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
