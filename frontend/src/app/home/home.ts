import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly currentYear = new Date().getFullYear();

  readonly classPrograms = [
    {
      age: '6 months – 1 year',
      name: 'Tiny Sparks',
      description:
        'Our caring environment nurtures the youngest learners with sensory play, music, and gentle introduction to social interaction.',
    },
    {
      age: '1 – 2 years',
      name: 'Little Embers',
      description:
        'Encouraging independence and exploration through age-appropriate activities, language development, and creative play.',
    },
    {
      age: '2 – 3 years',
      name: 'Bright Flames',
      description:
        'Building confidence and social skills with structured learning, imaginative play, and early numeracy and literacy.',
    },
    {
      age: '3 – 4 years',
      name: 'Rising Blazes',
      description:
        'Preparing for formal schooling with advanced learning activities, problem-solving, and collaborative projects.',
    },
  ];

  readonly team = [
    { name: 'Wilhelmina Rosen', role: 'Principal', url: 'wilhelmina.jpg' },
    { name: 'Rebecca Nawej', role: 'Teacher', url: 'rebecca.jpg' },
    { name: 'Nazeema Moses', role: 'Teacher', url: 'nazeema.jpg' },
    { name: 'Yolanda Lewis', role: 'Teacher', url: 'yolanda.jpg' },
  ];
}
