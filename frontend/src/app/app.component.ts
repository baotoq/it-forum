import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar (sidenavToggle)="sidenav.toggle()"></app-navbar>
    <app-loading></app-loading>
    <mat-sidenav-container>
      <mat-sidenav #sidenav [mode]="smallScreen ? 'over' : 'side'" style="background-color: #F5F5F5">
        <app-sidenav></app-sidenav>
      </mat-sidenav>
      <div class="container-fluid">
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-container>
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
