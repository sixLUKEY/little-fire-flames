import { Directive, ElementRef, viewChild } from '@angular/core';

@Directive()
export abstract class AbstractDialog {
  protected dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');

  showDialog(): void {
    this.dialogRef()?.nativeElement.showModal();
  }

  closeDialog(): void {
    this.dialogRef()?.nativeElement.close();
  }
}
