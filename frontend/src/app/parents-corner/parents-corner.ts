import { Component } from '@angular/core';

export interface SubjectResult {
  subject: string;
  grade: string;
  feedback: string;
}

@Component({
  selector: 'app-parents-corner',
  imports: [],
  templateUrl: './parents-corner.html',
  styleUrl: './parents-corner.css',
})
export class ParentsCorner {
  subjectResults: SubjectResult[] = [
    { subject: 'Mathematics', grade: 'A', feedback: 'Strong problem-solving skills. Keep practising word problems.' },
    { subject: 'English', grade: 'B+', feedback: 'Good reading comprehension. Focus on essay structure.' },
    { subject: 'Science', grade: 'A-', feedback: 'Excellent in practicals. Revise chemical equations.' },
    { subject: 'History', grade: 'B', feedback: 'Good grasp of dates. Develop more analytical answers.' },
    { subject: 'Geography', grade: 'A', feedback: 'Very good map work and case study knowledge.' },
    { subject: 'Life Orientation', grade: 'A', feedback: 'Participates well and shows good values.' },
  ];
}
