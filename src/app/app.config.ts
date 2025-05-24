import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_THEME, createTheme, Theme } from '@angular/material/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

const myCustomTheme: Theme = createTheme({
  colorSchemes: {
    light: {
      primary: '#11CCAB',
      onPrimary: '#0F1E21',
      secondary: '#4D3FA6',
      onSecondary: '#ffffff',
      surface: '#19262B',
      background: '#0F1E21',
      error: '#B00020'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideAnimations(),
    { provide: MAT_THEME, useValue: myCustomTheme }
  ]
};
