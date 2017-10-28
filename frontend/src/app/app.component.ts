import { Component, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-loading class="fixed-top" style="z-index: 9999"></app-loading>
    <app-navbar (sidenavToggle)="sidenav.toggle()" class="fixed-top"></app-navbar>
    <mat-sidenav-container fullscreen>
      <mat-sidenav #sidenav [mode]="smallScreen ? 'over' : 'side'" [opened]="!smallScreen">
        <app-sidenav (selectChange)="sidenavSelectChange()"></app-sidenav>
      </mat-sidenav>
      <router-outlet></router-outlet>
    </mat-sidenav-container>
    <ng-snotify></ng-snotify>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  smallScreen = false;

  @ViewChild('sidenav') sidenav;

  @HostListener('window:resize')
  onResize() {
    this.smallScreen = window.innerWidth < 960;
  }

  constructor() {
    this.onResize();
  }

  sidenavSelectChange() {
    if (this.smallScreen) {
      this.sidenav.close();
    }
  }
}
