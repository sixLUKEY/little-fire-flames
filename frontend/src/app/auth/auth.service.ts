import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import type { AuthUser, LoginRequest, LoginResponse, UserRole } from '@api/types';

const TOKEN_KEY = 'lff_token';
const USER_KEY = 'lff_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private token: string | null = null;
  private user: AuthUser | null = null;

  /** Reactive state for templates. */
  readonly currentUser = signal<AuthUser | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t && u) {
        this.token = t;
        this.user = JSON.parse(u) as AuthUser;
        this.currentUser.set(this.user);
        this.isAuthenticated.set(true);
      }
    } catch {
      this.clear();
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): AuthUser | null {
    return this.user;
  }

  hasRole(role: UserRole): boolean {
    return this.user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.user != null && roles.includes(this.user.role);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.login(credentials).pipe(
      tap((res) => {
        this.token = res.token;
        this.user = {
          userId: res.userId,
          email: res.email,
          role: res.role,
        };
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(this.user));
        this.currentUser.set(this.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    this.clear();
    this.router.navigate(['/']);
  }

  private clear(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
