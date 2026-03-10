import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'lff-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  protected isTeachersCornerActive(): boolean {
    return this.router.url.startsWith('/learner-centre');
  }
}
