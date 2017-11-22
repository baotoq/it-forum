import { Injectable } from '@angular/core';
import { RequestService } from '../../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';

@Injectable()
export class DashboardService {

  constructor(private requestService: RequestService) {
  }

  getChartData(): Observable<any> {
    return this.requestService.get(API.TOPIC.GET_CHART_DATA);
  }
}
