import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
    <ng-snotify></ng-snotify>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
}
