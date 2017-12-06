import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { Topic } from '../../models/topic';


@Injectable()
export class TopicService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(API.TOPIC.URL);
  }

  getWithSubTopics(id: number): Observable<Topic> {
    return this.httpClient.get<Topic>(`${API.TOPIC.URL}/sub-topics/${id}`);
  }

  getWithThreads(id: number): Observable<Topic> {
    return this.httpClient.get<Topic>(`${API.TOPIC.URL}/threads-created-posts/${id}`);
  }

  getParentOptions(): Observable<any> {
    return this.httpClient.get(`${API.TOPIC.URL}/parent-options`);
  }

  getSubOptions(id: number): Observable<any> {
    return this.httpClient.get(`${API.TOPIC.URL}/sub-options/${id}`);
  }
}
