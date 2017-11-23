import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-column-chart',
  template: `
    <google-chart #chart [data]="bindData"></google-chart>
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
  dataTable: any = [
    ['Title', 'Number of'],
    ['Column 6', 6],
    ['Column 5', 5],
    ['Column 4', 4],
    ['Column 3', 3],
    ['Column 2', 2],
    ['Column 1', 1],
  ];

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
