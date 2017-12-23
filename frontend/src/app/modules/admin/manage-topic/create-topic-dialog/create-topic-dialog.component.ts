import { Component, Inject, OnInit } from '@angular/core';
import { TopicService } from '../../../topic/topic.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Topic } from '../../../../models/topic';

@Component({
  selector: 'app-create-topic-dialog',
  template: `
    <h3 class="mt-2 text-mat-primary" align="center">Create Topic</h3>
    <mat-form-field class="w-100">
      <input matInput placeholder="Name" required [(ngModel)]="name">
    </mat-form-field>
    <mat-form-field class="w-100">
      <input matInput placeholder="Description" required [(ngModel)]="description">
    </mat-form-field>
    <div class="clearfix">
      <div class="float-right">
        <button mat-button color="accent" mat-dialog-close>Cancel</button>
        <button mat-button color="primary" (click)="onSave()" [disabled]="loading">
          <app-fa-spinner *ngIf="loading"></app-fa-spinner>
          <ng-container *ngIf="!loading">Save</ng-container>
        </button>
      </div>
    </div>
  `,
})
export class CreateTopicDialogComponent implements OnInit {
  name: string;
  description: string;

  parent: Topic;

  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private topicService: TopicService) {
  }

  ngOnInit() {
    this.parent = this.data;
  }

  onSave() {
    this.loading = true;
    const topic = new Topic();
    topic.name = this.name;
    topic.description = this.description;
    topic.level = this.parent.level + 1;
    topic.parentId = this.parent.id;

    this.topicService.create(topic)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        console.log('a');
      });
  }
}
