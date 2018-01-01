import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { Topic } from '../../models/topic';
import { Thread } from '../../models/thread';
import { ApprovalStatus } from '../../models/approval-status';


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

  getAllDeletedWithSubTopics(): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(`${API.TOPIC.URL}/deleted/subs`);
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

  getApprovedAndPendingThreads(id: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(`${API.TOPIC.URL}/approved-pending-threads/${id}`);
  }

  getThreads(id: number, approvalStatus: ApprovalStatus): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(`${API.TOPIC.URL}/threads/${id}?approvalStatus=${approvalStatus}`);
  }

  create(topic: Topic): Observable<any> {
    return this.httpClient.post(API.TOPIC.URL, topic);
  }

  edit(topic: Topic): Observable<any> {
    return this.httpClient.put(API.TOPIC.URL, topic);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${API.TOPIC.URL}/${id}`);
  }

  move(id: number, parentId): Observable<any> {
    return this.httpClient.post(`${API.TOPIC.URL}/move/${id}?parentId=${parentId}`, {});
  }

  reorder(topic: Topic): Observable<any> {
    return this.httpClient.post(`${API.TOPIC.URL}/re-order`, topic);
  }

  restore(id: number): Observable<any> {
    return this.httpClient.post(`${API.TOPIC.URL}/restore/${id}`, {});
  }

  permanentlyDelete(id: number): Observable<any> {
    return this.httpClient.delete(`${API.TOPIC.URL}/permanently/${id}`);
  }
}
