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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';  // Import MatExpansionModule
import { MatListModule } from '@angular/material/list';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()), // Enable fetch API
    importProvidersFrom(ReactiveFormsModule,MatListModule,BrowserAnimationsModule,MatExpansionModule, BaseChartDirective,FormsModule,MatInputModule,MatFormFieldModule), // Provide ReactiveFormsModule and ChartsModule here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
