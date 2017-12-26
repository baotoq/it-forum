import { Component, Inject, OnInit } from '@angular/core';
import { Topic } from '../../../../models/topic';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TopicService } from '../../../topic/topic.service';
import { LoadingService } from '../../../../components/loading/loading.service';

@Component({
  selector: 'app-move-dialog',
  template: `
    <h3 mat-dialog-title class="mb-1 text-mat-primary" align="center">Move Topic</h3>
    <mat-dialog-content>
      <mat-form-field class="w-100">
        <mat-select placeholder="Parent Topic" [(ngModel)]="selected">
          <mat-option *ngFor="let p of parentTopics | orderBy:'name'" [value]="p.id">
            {{ p.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
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
export class MoveDialogComponent implements OnInit {
  parentTopics: Topic[];

  selected;

  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private topicService: TopicService,
              private loadingService: LoadingService,
              private dialogRef: MatDialogRef<MoveDialogComponent>) {
  }

  ngOnInit() {
    this.topicService.getAll(0).subscribe(resp => {
      this.parentTopics = resp;
      this.selected = this.data.parentId;
    });
  }

  onSave() {
    this.loading = true;
    this.topicService.move(this.data.id, this.selected)
      .finally(() => this.loading = false)
      .subscribe(() => this.dialogRef.close(this.selected));
  }
}
