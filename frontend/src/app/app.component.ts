import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar (sidenavToggle)="sidenav.toggle()" class="fixed-top"></app-navbar>
    <div class="main">
      <app-loading></app-loading>
      <mat-sidenav-container>
        <mat-sidenav #sidenav [mode]="smallScreen ? 'over' : 'side'">
          <app-sidenav></app-sidenav>
        </mat-sidenav>
        <div class="container-fluid">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-container>
    </div>
    <ng-snotify></ng-snotify>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  smallScreen = false;

  @HostListener('window:resize')
  onResize() {
    this.smallScreen = window.innerWidth < 576;
  }

  constructor() {
    this.onResize();
  }
}
