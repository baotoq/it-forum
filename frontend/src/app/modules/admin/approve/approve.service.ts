import { Injectable } from '@angular/core';
import { RequestService } from '../../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/user';
import { API } from '../../shared/common/api';
import { Thread } from '../../../models/thread';
import { Post } from '../../../models/post';
import { ApprovalStatus } from '../../../models/approval-status';

@Injectable()
export class ApproveService {

  constructor(private requestService: RequestService) {
  }

  getUnapproveUsers(): Observable<User[]> {
    return this.requestService.authGet(API.USER.UNAPPROVE);
  }

  approveUsers(payload: number[]): Observable<any> {
    return this.requestService.authPost(API.USER.APPROVE, {
      data: payload,
    });
  }

  declineUsers(payload: number[]): Observable<any> {
    return this.requestService.authPost(API.USER.DECLINE, {
      data: payload,
    });
  }

  getPendingPosts(): Observable<Post[]> {
    return this.requestService.authGet(API.POST.PENDING);
  }

  approvePost(id: number, approvalStatus: ApprovalStatus): Observable<any> {
    return this.requestService.authPost(`${API.POST.URL}/modify-approval-status/${id}?approvalStatus=${approvalStatus}`);
  }
}
