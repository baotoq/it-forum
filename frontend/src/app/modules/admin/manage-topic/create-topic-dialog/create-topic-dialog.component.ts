import { Component, Inject, OnInit } from '@angular/core';
import { TopicService } from '../../../topic/topic.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Topic } from '../../../../models/topic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-topic-dialog',
  template: `
    <h3 mat-dialog-title class="mb-1 text-mat-primary" align="center">Create Topic</h3>
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
export class CreateTopicDialogComponent implements OnInit {
  form: FormGroup;

  parent: Topic;

  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private topicService: TopicService,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<CreateTopicDialogComponent>) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
    this.parent = this.data;
  }

  onSave() {
    this.loading = true;
    const topic = new Topic();
    topic.name = this.form.get('name').value;
    topic.description = this.form.get('description').value;
    topic.level = 0;
    topic.orderIndex = -1;
    if (this.parent != null) {
      topic.level = this.parent.level + 1;
      topic.parentId = this.parent.id;
    }

    this.topicService.create(topic)
      .finally(() => this.loading = false)
      .subscribe(resp => this.dialogRef.close(resp));
  }
}
