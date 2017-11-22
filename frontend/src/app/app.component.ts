import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  template: `
    <app-progress-bar></app-progress-bar>
    <app-navbar (sidenavToggle)="sidenavToggle()" class="fixed-top"></app-navbar>
    <mat-sidenav-container fullscreen>
      <mat-sidenav #sidenav [mode]="mode" [opened]="!smallScreen" (close)="redraw()" (open)="redraw()">
        <app-sidenav (selectChange)="sidenavSelectChange()"></app-sidenav>
      </mat-sidenav>
      <app-spinner></app-spinner>
      <router-outlet (activate)="onActivate($event)"></router-outlet>
      <div [style.height.px]="60"></div>
    </mat-sidenav-container>
    <ng-snotify></ng-snotify>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  smallScreen = false;
  mode = 'side';
  dashboardComponent: DashboardComponent;

  @ViewChild('sidenav') sidenav;

  @HostListener('window:resize')
  onResize() {
    this.smallScreen = window.innerWidth < 960;
    if (this.smallScreen) this.mode = 'over';
    else this.mode = 'side';
  }

  constructor() {
    this.onResize();
  }

  ngOnInit() {
  }

  sidenavSelectChange() {
    if (this.smallScreen) {
      this.sidenav.close();
    }
  }

  onActivate($event) {
    if ($event instanceof DashboardComponent)
      this.dashboardComponent = $event;
  }

  sidenavToggle() {
    this.sidenav.toggle();
  }

  redraw() {
    if (this.dashboardComponent) this.dashboardComponent.redraw();
  }
}
