import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div mat-dialog-content class="d-flex justify-content-center">
      <p>Are you sure?</p>
    </div>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true" tabindex="-1">Yes</button>
      <button mat-button mat-dialog-close tabindex="-1">No</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
