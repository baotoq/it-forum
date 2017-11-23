import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-column-chart',
  template: `
    <google-chart #chart *ngIf="dataTable" [data]="bindData"></google-chart>
  `,
})
export class ColumnChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart;

  @Input() vAxis: string;

  @Input() hAxis: string;

  @Input() colors = ['#3366cc'];

  @Input() position = 'none';

  @Input() stacked = false;

  @Input() height = 500;

  @Input()
  dataTable: any;

  bindData: any;

  constructor() {
  }

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateChart();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateChart();
  }

  redraw() {
    this.updateChart();
  }

  updateChart() {
    this.bindData = {
      chartType: 'ColumnChart',
      options: {
        colors: this.colors,
        isStacked: this.stacked,
        hAxis: {title: this.hAxis},
        vAxis: {title: this.vAxis},
        legend: {position: this.position},
        height: this.height,
        chartArea: {
          width: '90%',
        },
        animation: {
          startup: true,
          easing: 'inAndOut',
          duration: 1000,
        },
      },
      dataTable: this.dataTable,
    };
  }
}
