import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-spinner',
  template: `
    <div class="overlay" [style.left.px]="padding" [style.width]="width">
      <div class="d-flex justify-content-center align-items-center h-100">
        <mat-spinner [diameter]="50" [strokeWidth]="4"></mat-spinner>
      </div>
    </div>
  `,
  styleUrls: ['./material-spinner.component.scss'],
})
export class MaterialSpinnerComponent implements OnInit {
  @Input() padding = 0;
  width: string;

  constructor() {
  }

  ngOnInit() {
    this.width = `calc(100% - ${this.padding * 2}px)`;
  }
}
