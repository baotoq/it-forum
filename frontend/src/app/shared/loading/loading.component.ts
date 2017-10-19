import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
  `,
})
export class LoadingComponent implements OnInit {
  loading = false;

  constructor(private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.loadingService.status.subscribe((val: boolean) => this.loading = val);
  }
}
