import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    admin
    <router-outlet></router-outlet>
  `,
})
export class AdminLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
