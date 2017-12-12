import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';
import { User } from '../../../models/user';
import { Post } from '../../../models/post';

@Injectable()
export class ApproveService {

  constructor(private httpClient: HttpClient) {
  }

  getUnapproveUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(API.USER.UNAPPROVE);
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

  approveThread(id: number): Observable<any> {
    return this.httpClient.post(`${API.THREAD.URL}/approve/${id}`, {});
  }
}
