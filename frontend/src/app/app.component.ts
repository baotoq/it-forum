import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  template: `
    <app-progress-bar></app-progress-bar>
    <router-outlet></router-outlet>
    <ng-snotify></ng-snotify>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
