import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-progress-bar class="fixed-top" style="z-index: 10000"></app-progress-bar>
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
