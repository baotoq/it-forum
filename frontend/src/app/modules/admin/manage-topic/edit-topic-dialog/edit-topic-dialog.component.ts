import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Topic } from '../../../../models/topic';
import { TopicService } from '../../../topic/topic.service';

@Component({
  selector: 'app-edit-topic-dialog',
  template: `
    <h3 mat-dialog-title class="mb-1 text-mat-primary" align="center">Edit Topic</h3>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="w-100">
          <input matInput placeholder="Name" formControlName="name">
        </mat-form-field>
        <mat-form-field class="w-100">
          <textarea matInput placeholder="Description" formControlName="description"
                    matTextareaAutosize matAutosizeMinRows="1"
                    matAutosizeMaxRows="5"></textarea>
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
export class EditTopicDialogComponent implements OnInit {
  form: FormGroup;

  topic: Topic;

  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private topicService: TopicService,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<EditTopicDialogComponent>) {
  }

  ngOnInit() {
    this.topic = this.data;
    this.form = this.formBuilder.group({
      name: [this.topic.name, Validators.required],
      description: [this.topic.description, Validators.required],
    });
  }

  onSave() {
    this.loading = true;
    this.topic.name = this.form.get('name').value;
    this.topic.description = this.form.get('description').value;

    this.topicService.edit(this.topic)
      .finally(() => this.loading = false)
      .subscribe(resp => this.dialogRef.close(resp));
  }
}
