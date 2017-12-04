import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { LoadingService } from '../../../../components/loading/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart1') chart1;
  @ViewChild('chart2') chart2;
  @ViewChild('chart3') chart3;
  @ViewChild('chart4') chart4;

  threadsDataTable;
  postsDataTable;

  threadLifetimeDataTable;
  postLifetimeDataTable;

  constructor(private loadingService: LoadingService,
              private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.dashboardService.getThreadStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.threadsDataTable = this.prepareColumnChart('Number of threads', resp));
    this.dashboardService.getPostStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.postsDataTable = this.prepareColumnChart('Number of posts', resp));
    this.dashboardService.getThreadsPerMonthStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.threadLifetimeDataTable = this.prepareLineChart('Number of threads', resp));
    this.dashboardService.getPostsPerMonthStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.postLifetimeDataTable = this.prepareLineChart('Number of posts', resp));
  }

  private prepareColumnChart(title: string, data: any) {
    data = [
      ['Title', title],
      ...data.map(item => [item.key, item.value])
    ];
    return data.slice(0, 10);
  }

  private prepareLineChart(title: string, data: any) {
    console.log(data);
    data = [
      ['Title', title],
      ...data.map(item => [new Date(item.key.year, item.key.month - 1), item.value])
    ];
    console.log(data);
    return data;
  }
}
