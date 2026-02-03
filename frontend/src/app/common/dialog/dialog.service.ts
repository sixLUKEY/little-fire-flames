import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Type
} from '@angular/core';
import { AbstractDialog } from './abstract-dialog';
import { DialogType } from 'src/app/learner-centre/learners/types';
import { CreateLearner } from 'src/app/learner-centre/learners/create-learner/create-learner';
import { UpdateLearner } from 'src/app/learner-centre/learners/update-learner/update-learner';
import { DeleteLearner } from 'src/app/learner-centre/learners/delete-learner/delete-learner';
import { CreateClass } from 'src/app/learner-centre/classes/create-class/create-class';
import { UpdateClass } from 'src/app/learner-centre/classes/update-class/update-class';
import { DeleteClass } from 'src/app/learner-centre/classes/delete-class/delete-class';
import { CreateSubject } from 'src/app/learner-centre/subjects/create-subject/create-subject';
import { UpdateSubject } from 'src/app/learner-centre/subjects/update-subject/update-subject';
import { DeleteSubject } from 'src/app/learner-centre/subjects/delete-subject/delete-subject';
import { CreateTeacher } from 'src/app/learner-centre/teachers/create-teacher/create-teacher';
import { UpdateTeacher } from 'src/app/learner-centre/teachers/update-teacher/update-teacher';
import { DeleteTeacher } from 'src/app/learner-centre/teachers/delete-teacher/delete-teacher';

export const MODAL_TYPE_COMPONENT_MAP: Record<DialogType, Type<AbstractDialog>> = {
  // Learners
  createLearner: CreateLearner,
  updateLearner: UpdateLearner,
  deleteLearner: DeleteLearner,
  // Classes
  createClass: CreateClass,
  updateClass: UpdateClass,
  deleteClass: DeleteClass,
  // Subjects
  createSubject: CreateSubject,
  updateSubject: UpdateSubject,
  deleteSubject: DeleteSubject,
  // Teachers
  createTeacher: CreateTeacher,
  updateTeacher: UpdateTeacher,
  deleteTeacher: DeleteTeacher,
};

@Injectable({ providedIn: 'root' })
export class DialogService {
  private componentRef: ComponentRef<any> | null = null;
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  show(dialogType: DialogType): ComponentRef<any> | null {
    this.close();

    const component = MODAL_TYPE_COMPONENT_MAP[dialogType];

    // Create the modal component with DI context
    this.componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector
    });
    this.document.body.appendChild(this.componentRef.location.nativeElement);

    // Attach the component to Angular’s change detection and trigger an immediate update.
    this.appRef.attachView(this.componentRef.hostView);
    this.componentRef.changeDetectorRef.detectChanges();

    // If available, call showDialog() to display the modal
    if (this.componentRef?.instance?.showDialog) {
      this.componentRef.instance.showDialog();
    }

    return this.componentRef;
  }

  /**
   * Disposes the currently open modal and overlay.
   */
  close(): void {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
