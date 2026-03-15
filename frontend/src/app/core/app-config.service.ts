import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { AppConfig } from './app-config';

const FALLBACK_API_URL = 'http://localhost:3000';
const FALLBACK_COGNITO: AppConfig['cognito'] = { userPoolId: '', clientId: '', region: '' };

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private config: AppConfig | null = null;

  async loadConfig(): Promise<AppConfig> {
    if (this.config) return this.config;
    try {
      const cfg = await firstValueFrom(this.http.get<AppConfig>('/config.json'));
      if (cfg?.apiUrl) {
        this.config = cfg;
        return this.config;
      }
    } catch {
      if ((environment as { production?: boolean }).production) {
        console.error(
          '[AppConfig] Failed to load /config.json in production. ' +
            'Run deploy/scripts/fetch-stack-config.js and redeploy the frontend.',
        );
      }
    }
    const env = environment as { apiUrl?: string; cognito?: AppConfig['cognito'] };
    this.config = {
      apiUrl: env.apiUrl || FALLBACK_API_URL,
      cognito: env.cognito?.userPoolId ? env.cognito : FALLBACK_COGNITO,
    };
    return this.config;
  }

  getConfig(): AppConfig {
    if (!this.config) {
      const env = environment as { apiUrl?: string; cognito?: AppConfig['cognito'] };
      return {
        apiUrl: env.apiUrl || FALLBACK_API_URL,
        cognito: env.cognito?.userPoolId ? env.cognito : FALLBACK_COGNITO,
      };
    }
    return this.config;
  }

  get apiUrl(): string {
    return this.getConfig().apiUrl;
  }

  get cognito(): AppConfig['cognito'] {
    return this.getConfig().cognito;
  }
}
