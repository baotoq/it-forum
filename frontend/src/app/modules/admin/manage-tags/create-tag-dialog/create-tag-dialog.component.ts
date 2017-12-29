import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../../../models/tag';
import { TagService } from '../../../tag/tag.service';

@Component({
  selector: 'app-create-tag-dialog',
  template: `
    <h3 mat-dialog-title class="mb-1 text-mat-primary" align="center">Create Tag</h3>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="w-100">
          <input matInput placeholder="Name" formControlName="name">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <div class="clearfix">
      <div class="float-right">
        <button mat-button color="accent" mat-dialog-close>Cancel</button>
        <button mat-button color="primary" (click)="onSave()" [disabled]="loading || form.invalid">
          <app-fa-spinner *ngIf="loading"></app-fa-spinner>
          <ng-container *ngIf="!loading">Save</ng-container>
        </button>
      </div>
    </div>
  `,
})
export class CreateTagDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private formBuilder: FormBuilder,
              private tagService: TagService,
              private dialogRef: MatDialogRef<CreateTagDialogComponent>) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
    });
  }

  onSave() {
    this.loading = true;
    const tag = new Tag();
    tag.name = this.form.get('name').value;

    this.tagService.create(tag)
      .finally(() => this.loading = false)
      .subscribe(() => this.dialogRef.close(tag));
  }
}
