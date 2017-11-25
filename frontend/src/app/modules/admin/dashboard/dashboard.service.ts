import { Injectable } from '@angular/core';
import { RequestService } from '../../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';

@Injectable()
export class DashboardService {

  constructor(private requestService: RequestService) {
  }

  getThreadStatistic(): Observable<any> {
    return this.requestService.authGet(API.STATISTIC.THREADS_PER_TOPIC);
  }

  getPostStatistic(): Observable<any> {
    return this.requestService.authGet(API.STATISTIC.POSTS_PER_TOPIC);
  }

  getThreadsPerMonthStatistic(): Observable<any> {
    return this.requestService.authGet(API.STATISTIC.URL + '/threads-per-month');
  }

  getPostsPerMonthStatistic(): Observable<any> {
    return this.requestService.authGet(API.STATISTIC.URL + '/posts-per-month');
  }
}
