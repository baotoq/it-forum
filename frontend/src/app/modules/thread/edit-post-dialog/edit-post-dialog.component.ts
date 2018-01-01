import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Post } from '../../../models/post';
import { ThreadService } from '../thread.service';

@Component({
  selector: 'app-edit-post-dialog',
  template: `
    <h3 mat-dialog-title class="mb-1 text-mat-primary" align="center">Edit Post</h3>
    <mat-dialog-content>
      <form [formGroup]="form">
        <md-editor formControlName="content" required></md-editor>
      </form>
    </mat-dialog-content>
    <div class="clearfix" cdkFocusRegionstart>
      <div class="float-right">
        <button mat-button color="primary" (click)="onSave()" [disabled]="loading || form.invalid">
          <app-fa-spinner *ngIf="loading"></app-fa-spinner>
          <ng-container *ngIf="!loading">Save</ng-container>
        </button>
      </div>
    </div>
  `,
})
export class EditPostDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private formBuilder: FormBuilder,
              private threadService: ThreadService,
              private dialogRef: MatDialogRef<EditPostDialogComponent>) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      content: [this.data.content, Validators.required],
    });
  }

  onSave() {
    this.loading = true;
    const post = new Post();
    post.id = this.data.id;
    post.content = this.form.get('content').value;

    this.threadService.editPost(post)
      .finally(() => this.loading = false)
      .subscribe(() => this.dialogRef.close(post));
  }
}
