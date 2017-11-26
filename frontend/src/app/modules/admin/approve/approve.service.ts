import { Injectable } from '@angular/core';
import { RequestService } from '../../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/user';
import { API } from '../../shared/common/api';

@Injectable()
export class ApproveService {

  constructor(private requestService: RequestService) {
  }

  getUnapprove(): Observable<User[]> {
    return this.requestService.authGet(API.USER.UNAPPROVE);
  }

  approve(payload: number[]): Observable<any> {
    return this.requestService.authPost(API.USER.APPROVE, {
      data: payload,
    });
  }

  decline(payload: number[]): Observable<any> {
    return this.requestService.authPost(API.USER.DECLINE, {
      data: payload,
    });
  }
}
