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
  loading = false;

  @ViewChild('threadChart') threadChart;
  @ViewChild('postChart') postChart;

  threadsDataTable = [];
  postsDataTable = [];

  constructor(private loadingService: LoadingService,
              private orderByPipe: OrderByPipe,
              private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loading = true;
    this.loadingService.spinnerStart();
    this.dashboardService.getChartData()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.threadsDataTable = this.prepareThreadsDataTable(resp);
        this.postsDataTable = this.preparePostsDataTable(resp);
        this.loading = false;
      });
  }

  private prepareThreadsDataTable(topics: any) {
    let data = this.orderByPipe.transform(topics, ['-numberOfThreads']);
    data = data.map(topic => [topic.name, topic.numberOfThreads]);

    return [
      ['Title', 'Number of threads'],
      ...data.slice(0, 10)
    ];
  }

  private preparePostsDataTable(topics: any) {
    let data = this.orderByPipe.transform(topics, ['-numberOfPosts']);
    data = data.map(topic => [topic.name, topic.numberOfPosts]);

    return [
      ['Title', 'Number of posts'],
      ...data.slice(0, 10)
    ];
  }
}
