import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <i class="fa fa-spinner fa-pulse fa-{{size}}x fa-fw"></i>
  `,
})
export class SpinnerComponent implements OnInit {
  @Input() size = 1;

  constructor() {
  }

  ngOnInit() {
  }

}
