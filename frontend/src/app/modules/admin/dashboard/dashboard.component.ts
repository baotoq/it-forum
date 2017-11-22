import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { LoadingService } from '../../../components/loading/loading.service';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  loading = false;
  chartData = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: {
      isStacked: true,
      hAxis: {title: 'Threads'},
      height: '500',
      chartArea: {
        width: '90%',
      },
      animation: {
        startup: true,
        easing: 'inAndOut',
        duration: 1000,
      },
      legend: {position: 'top', maxLines: 3},
    },
  };

  constructor(private loadingService: LoadingService,
              private orderByPipe: OrderByPipe,
              private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loading = true;
    this.dashboardService.getThreadChartData()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        console.log(resp);
        this.chartData.dataTable = this.prepareDataTable(resp);
        this.loading = false;
      });
  }

  private prepareDataTable(topics: any) {
    let data = this.orderByPipe.transform(topics, ['-numberOfThreads']);
    data = data.map(topic => [topic.name, topic.numberOfThreads]);

    return [
      ['Title', 'Number of threads'],
      ...data.slice(0, 12)
    ];
  }
}
