import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    client
    <router-outlet></router-outlet>
  `,
})
export class ClientLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
