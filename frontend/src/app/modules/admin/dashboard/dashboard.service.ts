import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';


@Injectable()
export class DashboardService {

  constructor(private httpClient: HttpClient) {
  }

  getThreadStatistic(): Observable<any> {
    return this.httpClient.get(API.STATISTIC.THREADS_PER_TOPIC);
  }

  getPostStatistic(): Observable<any> {
    return this.httpClient.get(API.STATISTIC.POSTS_PER_TOPIC);
  }

  getThreadsPerMonthStatistic(): Observable<any> {
    return this.httpClient.get(API.STATISTIC.URL + '/threads-per-month');
  }

  getPostsPerMonthStatistic(): Observable<any> {
    return this.httpClient.get(API.STATISTIC.URL + '/posts-per-month');
  }
}
