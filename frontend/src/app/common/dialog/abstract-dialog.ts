import { Directive, ElementRef, viewChild } from '@angular/core';

@Directive()
export abstract class AbstractDialog {
  protected dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');

  showDialog(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) return;
    dialog.showModal();
    requestAnimationFrame(() => {
      dialog.classList.add('lff-dialog-open');
    });
  }

  closeDialog(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) return;
    dialog.classList.add('lff-dialog-closing');
    let done = false;
    const onEnd = (): void => {
      if (done) return;
      done = true;
      dialog.removeEventListener('transitionend', onEnd);
      dialog.classList.remove('lff-dialog-closing', 'lff-dialog-open');
      dialog.close();
      clearTimeout(fallback);
    };
    dialog.addEventListener('transitionend', onEnd);
    const fallback = setTimeout(onEnd, 250);
  }
}
