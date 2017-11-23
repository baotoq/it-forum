import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { LoadingService } from '../../../components/loading/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart1') chart1;
  @ViewChild('chart2') chart2;
  @ViewChild('chart3') chart3;
  @ViewChild('chart4') chart4;

  threadsDataTable;
  postsDataTable;
  threadsPerMonthDataTable;
  postsPerMonthDataTable;

  constructor(private loadingService: LoadingService,
              private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.dashboardService.getThreadStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.threadsDataTable = this.prepareDataTable('Number of threads', resp));
    this.dashboardService.getPostStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.postsDataTable = this.prepareDataTable('Number of posts', resp));
    this.dashboardService.getThreadsPerMonthStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.threadsPerMonthDataTable = this.prepareDataTable('Number of threads', resp));
    this.dashboardService.getPostsPerMonthStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.postsPerMonthDataTable = this.prepareDataTable('Number of posts', resp));
  }

  private prepareDataTable(title: string, data: any, take: number = 10) {
    return [
      ['Title', title],
      ...data.map(item => [item.key, item.value]).slice(0, take)
    ];
  }
}
