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

  getAll(level: number): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(`${API.TOPIC.URL}?level=${level}`);
  }

  getAllWithSubTopics(level: number): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(`${API.TOPIC.URL}/subs?level=${level}`);
  }

  getAllWithSubTopicsAndThreads(level: number): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(`${API.TOPIC.URL}/sub-threads?level=${level}`);
  }

  getWithSubTopics(id: number): Observable<Topic> {
    return this.httpClient.get<Topic>(`${API.TOPIC.URL}/subs/${id}`);
  }

  getWithManagements(id: number): Observable<Topic> {
    return this.httpClient.get<Topic>(`${API.TOPIC.URL}/managements/${id}`);
  }

  getParentOptions(): Observable<any> {
    return this.httpClient.get(`${API.TOPIC.URL}/parent-options`);
  }

  getSubOptions(id: number): Observable<any> {
    return this.httpClient.get(`${API.TOPIC.URL}/sub-options/${id}`);
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

  create(topic: Topic): Observable<any> {
    return this.httpClient.post(API.TOPIC.URL, topic);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${API.TOPIC.URL}/${id}`);
  }
}
