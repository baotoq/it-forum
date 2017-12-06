import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';
import { User } from '../../../models/user';
import { Post } from '../../../models/post';
import { ApprovalStatus } from '../../../models/approval-status';

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

  approvePost(id: number, approvalStatus: ApprovalStatus): Observable<any> {
    return this.httpClient.post(`${API.POST.URL}/modify-approval-status/${id}?approvalStatus=${approvalStatus}`, {});
  }
}
