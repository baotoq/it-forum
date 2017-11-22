import { Injectable } from '@angular/core';
import { RequestService } from '../../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';
import { User } from '../../../models/user';

@Injectable()
export class DashboardService {

  constructor(private requestService: RequestService) {
  }

  getThreadChartData(): Observable<any> {
      return this.requestService.get(API.TOPIC.GET_NUMBER_OF_THREADS);
  }
}
