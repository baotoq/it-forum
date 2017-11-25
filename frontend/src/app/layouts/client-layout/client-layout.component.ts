import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <app-navbar class="fixed-top"></app-navbar>
    <div class="main">
      <app-spinner></app-spinner>
      <router-outlet></router-outlet>
      <div [style.height.px]="60"></div>
    </div>
  `,
  styleUrls: ['./client-layout.component.scss'],
})
export class ClientLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
