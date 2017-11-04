import { Injectable } from '@angular/core';
import { RequestService } from '../../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { API } from '../../shared/common/api';
import { User } from '../../../models/user';

@Injectable()
export class ConfirmService {

  constructor(private requestService: RequestService) {
  }

  getUnconfirmedUser(): Observable<User[]> {
    return this.requestService.authGet(API.USER.GET_UNCONFIRMED);
  }

  confirmUser(id: number): Observable<any> {
    return this.requestService.authPost(`${API.USER.CONFIRM}/${id}`);
  }

}
