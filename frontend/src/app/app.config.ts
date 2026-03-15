import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { AppConfigService } from './core/app-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appConfigService: AppConfigService) => () => appConfigService.loadConfig(),
      deps: [AppConfigService],
      multi: true,
    },
  ],
};
