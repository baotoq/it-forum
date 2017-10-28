import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { API } from '../shared/common/api';
import { Topic } from '../../models/topic';

@Injectable()
export class TopicService {

  constructor(private requestService: RequestService) {
  }

  getAll(): Observable<Topic[]> {
    return this.requestService.get(API.TOPIC.GET_ALL);
  }

  get(id: number): Observable<Topic> {
    return this.requestService.get(`${API.TOPIC.GET}/${id}`);
  }
}
