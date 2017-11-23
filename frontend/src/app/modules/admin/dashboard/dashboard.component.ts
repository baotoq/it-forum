import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { LoadingService } from '../../../components/loading/loading.service';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  @ViewChild('threadChart') threadChart;
  @ViewChild('postChart') postChart;

  threadsDataTable;
  postsDataTable;

  constructor(private loadingService: LoadingService,
              private orderByPipe: OrderByPipe,
              private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.dashboardService.getThreadStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.threadsDataTable = [
          ['Title', 'Number of threads'],
          ...resp.map(item => [item.name, item.numberOfThreads])
        ];
      });
    this.dashboardService.getPostStatistic()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.postsDataTable = [
          ['Title', 'Number of posts'],
          ...resp.map(item => [item.name, item.numberOfPosts])
        ];
      });
  }
}
