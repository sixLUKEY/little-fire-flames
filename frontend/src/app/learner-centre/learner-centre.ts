import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'lff-learner-centre',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './learner-centre.html',
  styleUrl: './learner-centre.css',
})
export class LearnerCentre {
}
