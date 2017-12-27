import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TopicService } from '../../../topic.service';
import { ThreadService } from '../../../../thread/thread.service';
import { Topic } from '../../../../../models/topic';
import { CoreService } from '../../../../core/core.service';

@Component({
  selector: 'app-move-thread-dialog',
  template: `
    <h3 mat-dialog-title class="mb-1 text-mat-primary" align="center">Move Thread</h3>
    <mat-dialog-content>
      <mat-form-field class="w-100">
        <mat-select placeholder="Topic" [(ngModel)]="selected" required>
          <mat-optgroup *ngFor="let topic of topicOptions | orderBy:'orderIndex'"
                        [label]="topic.name" [title]="topic.description">
            <mat-option *ngFor="let sub of topic.subTopics | orderBy:'orderIndex'"
                        [value]="sub.id" [title]="sub.description">
              {{ sub.name }}
            </mat-option>
          </mat-optgroup>
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
export class MoveThreadDialogComponent implements OnInit {
  topicOptions: Topic[];

  selected;

  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private topicService: TopicService,
              private threadService: ThreadService,
              private coreService: CoreService,
              private dialogRef: MatDialogRef<MoveThreadDialogComponent>) {
  }

  ngOnInit() {
    this.topicService.getAllWithSubTopics(0).subscribe(resp => {
      this.topicOptions = resp;
      this.selected = this.data.topicId;
    });
  }

  onSave() {
    if (this.data.topicId === this.selected) {
      this.dialogRef.close();
      return;
    }

    this.loading = true;
    this.threadService.move(this.data.id, this.selected)
      .finally(() => this.loading = false)
      .subscribe(() => {
        this.dialogRef.close(this.selected);
        this.coreService.notifySuccess();
      });
  }
}
