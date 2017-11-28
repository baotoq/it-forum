import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { Topic } from '../../models/topic';

@Injectable()
export class TopicService {

  constructor(private requestService: RequestService) {
  }

  getAll(): Observable<Topic[]> {
    return this.requestService.get(API.TOPIC.URL);
  }

  getWithSubTopics(id: number): Observable<Topic> {
    return this.requestService.get(`${API.TOPIC.URL}/sub-topics/${id}`);
  }

  getWithThreads(id: number): Observable<Topic> {
    return this.requestService.get(`${API.TOPIC.URL}/threads-created/${id}`);
  }

  getParentOptions(): Observable<any> {
    return this.requestService.get(`${API.TOPIC.URL}/parent-options`);
  }

  getSubOptions(id: number): Observable<any> {
    return this.requestService.get(`${API.TOPIC.URL}/sub-options/${id}`);
  }
}
