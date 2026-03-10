import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'lff-learner-centre',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './learner-centre.html',
  styleUrl: './learner-centre.css',
})
export class LearnerCentre {
  protected readonly auth = inject(AuthService);
}
