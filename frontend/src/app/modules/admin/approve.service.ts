import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { User } from '../../models/user';
import { ApprovalStatus } from '../../models/approval-status';

@Injectable()
export class ApproveService {

  constructor(private httpClient: HttpClient) {
  }

  getPendingUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${API.USER.APPROVE_STATUS}?approvalStatus=${ApprovalStatus.Pending}`);
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

  approvePost(id: number): Observable<any> {
    return this.httpClient.post(`${API.POST.URL}/approve/${id}`, {});
  }

  declinePost(id: number): Observable<any> {
    return this.httpClient.post(`${API.POST.URL}/decline/${id}`, {});
  }

  approveThread(id: number): Observable<any> {
    return this.httpClient.post(`${API.THREAD.URL}/approve/${id}`, {});
  }

  declineThread(id: number): Observable<any> {
    return this.httpClient.post(`${API.THREAD.URL}/decline/${id}`, {});
  }
}
