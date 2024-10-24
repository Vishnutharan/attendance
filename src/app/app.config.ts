import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          const authService = inject(AuthService);
          const token = authService.getToken();
          
          if (token) {
            const authReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next(authReq);
          }
          return next(req);
        }
      ])
    ),
    provideRouter(
      routes,
      withViewTransitions()
    ),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};