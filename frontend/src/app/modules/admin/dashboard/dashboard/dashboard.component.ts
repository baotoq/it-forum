import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { DashboardService } from '../dashboard.service';
import { LoadingService } from '../../../../components/loading/loading.service';
import { LineChartComponent } from '../../../shared/components/line-chart/line-chart.component';
import { ColumnChartComponent } from '../../../shared/components/column-chart/column-chart.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChildren(LineChartComponent) lineCharts: QueryList<LineChartComponent>;
  @ViewChildren(ColumnChartComponent) columnCharts: QueryList<ColumnChartComponent>;

  threadsDataTable;
  postsDataTable;

  threadLifetimeDataTable;
  postLifetimeDataTable;

  constructor(private loadingService: LoadingService,
              private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    Observable.combineLatest(
      this.dashboardService.getThreadStatistic(),
      this.dashboardService.getPostStatistic(),
      this.dashboardService.getThreadsPerMonthStatistic(),
      this.dashboardService.getPostsPerMonthStatistic(),
    )
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.threadsDataTable = this.prepareColumnChart('Number of threads', resp[0]);
        this.postsDataTable = this.prepareColumnChart('Number of posts', resp[1]);
        this.threadLifetimeDataTable = this.prepareLineChart('Number of threads', resp[2]);
        this.postLifetimeDataTable = this.prepareLineChart('Number of posts', resp[3]);
      });
  }

  ngOnDestroy() {
  }

  private prepareColumnChart(title: string, data: any) {
    data = [
      ['Title', title],
      ...data.map(item => [item.key, item.value])
    ];
    return data;
  }

  private prepareLineChart(title: string, data: any) {
    data = [
      ['Title', title],
      ...data.map(item => [new Date(item.key.year, item.key.month - 1), item.value])
    ];
    return data;
  }

  redraw() {
    this.lineCharts.forEach(item => item.redraw());
    this.columnCharts.forEach(item => item.redraw());
  }
}
