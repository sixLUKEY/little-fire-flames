import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected form: FormGroup = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', Validators.required),
  });

  protected loading = signal(false);
  protected errorMessage = signal('');

  protected onSubmit(): void {
    this.errorMessage.set('');
    this.loading.set(true);
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: { error?: { message?: string }; message?: string; status?: number }) => {
        this.loading.set(false);
        const msg =
          err?.error?.message ??
          err?.message ??
          (err?.status === 0 ? 'Cannot reach server. Is the API running?' : 'Sign in failed. Please try again.');
        this.errorMessage.set(msg);
      },
    });
  }
}
