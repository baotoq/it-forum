import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';
import { User } from '../../../models/user';
import { Post } from '../../../models/post';
import { Thread } from '../../../models/thread';

@Injectable()
export class ApproveService {

  constructor(private httpClient: HttpClient) {
  }

  getPendingUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(API.USER.PENDING);
  }

  approveUsers(payload: number[]): Observable<any> {
    return this.httpClient.post(API.USER.APPROVE, {
      data: payload,
    });
  }

  declineUsers(payload: number[]): Observable<any> {
    return this.httpClient.post(API.USER.DECLINE, {
      data: payload,
    });
  }

  getPendingPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(API.POST.PENDING);
  }

  approvePost(id: number): Observable<any> {
    return this.httpClient.post(`${API.POST.URL}/approve/${id}`, {});
  }

  declinePost(id: number): Observable<any> {
    return this.httpClient.post(`${API.POST.URL}/decline/${id}`, {});
  }

  getPendingThreads(): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(API.THREAD.PENDING);
  }

  approveThread(id: number): Observable<any> {
    return this.httpClient.post(`${API.THREAD.URL}/approve/${id}`, {});
  }

  declineThread(id: number): Observable<any> {
    return this.httpClient.post(`${API.THREAD.URL}/decline/${id}`, {});
  }
}
