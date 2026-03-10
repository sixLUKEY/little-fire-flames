import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'lff-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly router = inject(Router);

  protected isTeachersCornerActive(): boolean {
    return this.router.url.startsWith('/learner-centre');
  }
}
