import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { Topic } from '../../models/topic';
import { Thread } from '../../models/thread';


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
    return this.httpClient.get<Topic>(`${API.TOPIC.URL}/threads-created/${id}`);
  }

  getParentOptions(): Observable<any> {
    return this.httpClient.get(`${API.TOPIC.URL}/parent-options`);
  }

  getSubOptions(id: number): Observable<any> {
    return this.httpClient.get(`${API.TOPIC.URL}/sub-options/${id}`);
  }

  getAllSubTopics(): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(`${API.TOPIC.URL}/all-sub-topics`);
  }

  getDefaultThreads(id: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(`${API.TOPIC.URL}/default-threads/${id}`);
  }

  getApprovedThreads(id: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(`${API.TOPIC.URL}/approved-threads/${id}`);
  }

  getPendingThreads(id: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(`${API.TOPIC.URL}/pending-threads/${id}`);
  }

  getDeclinedThreads(id: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(`${API.TOPIC.URL}/declined-threads/${id}`);
  }
}
