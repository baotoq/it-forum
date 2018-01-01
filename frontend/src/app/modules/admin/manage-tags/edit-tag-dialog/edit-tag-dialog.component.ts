import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { TagService } from '../../../tag/tag.service';
import { Tag } from '../../../../models/tag';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-tag-dialog',
  template: `
    <h3 mat-dialog-title class="mb-1 text-mat-primary" align="center">Edit Tag</h3>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="w-100">
          <input matInput placeholder="Name" formControlName="name" [readonly]="deleted">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <div class="clearfix">
      <div class="float-right">
        <ng-container *ngIf="!deleted">
          <button mat-button color="warn" (click)="delete()" [disabled]="loading || deleteLoading">
            <app-fa-spinner *ngIf="deleteLoading"></app-fa-spinner>
            <ng-container *ngIf="!deleteLoading">Delete</ng-container>
          </button>
          <button mat-button color="primary" (click)="onSave()" [disabled]="loading || form.invalid || deleteLoading">
            <app-fa-spinner *ngIf="loading"></app-fa-spinner>
            <ng-container *ngIf="!loading">Save</ng-container>
          </button>
        </ng-container>
        <ng-container *ngIf="deleted">
          <button mat-button color="warn" (click)="permanentlyDelete()" [disabled]="loading || deleteLoading">
            <app-fa-spinner *ngIf="deleteLoading"></app-fa-spinner>
            <ng-container *ngIf="!deleteLoading"> Permanently Delete</ng-container>
          </button>
          <button mat-button color="primary" (click)="restore()" [disabled]="loading || deleteLoading">
            <app-fa-spinner *ngIf="loading"></app-fa-spinner>
            <ng-container *ngIf="!loading">Restore</ng-container>
          </button>
        </ng-container>
      </div>
    </div>
  `,
})
export class EditTagDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;

  deleteLoading = false;

  deleted = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private formBuilder: FormBuilder,
              private tagService: TagService,
              private dialogRef: MatDialogRef<EditTagDialogComponent>,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.name, Validators.required],
    });
    this.deleted = this.data.dateDeleted != null;
  }

  onSave() {
    this.loading = true;
    const tag = new Tag();
    tag.id = this.data.id;
    tag.name = this.form.get('name').value;

    this.tagService.edit(tag)
      .finally(() => this.loading = false)
      .subscribe(() => this.dialogRef.close({action: 'edit', data: tag}));
  }

  delete() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.deleteLoading = true;
          this.tagService.delete(this.data.id)
            .finally(() => this.deleteLoading = false)
            .subscribe(() => this.dialogRef.close({action: 'delete'}));
        }
      });
  }

  permanentlyDelete() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.deleteLoading = true;
          this.tagService.permanentlyDelete(this.data.id)
            .finally(() => this.deleteLoading = false)
            .subscribe(() => this.dialogRef.close({action: 'delete'}));
        }
      });
  }

  restore() {
    this.loading = true;

    this.tagService.restore(this.data.id)
      .finally(() => this.loading = false)
      .subscribe(() => this.dialogRef.close({action: 'restore'}));
  }
}
