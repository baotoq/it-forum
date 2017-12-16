import { Injectable } from '@angular/core';
import { User } from '../../../models/user';
import { HttpClient } from '@angular/common/http';
import { API } from '../../shared/common/api';
import { Observable } from 'rxjs/Observable';
import { ApprovalStatus } from '../../../models/approval-status';

@Injectable()
export class ManageUserService {

  constructor(private httpClient: HttpClient) {
  }

  getApprovedUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${API.USER.APPROVE_STATUS}?approvalStatus=${ApprovalStatus.Approved}`);
  }
}
