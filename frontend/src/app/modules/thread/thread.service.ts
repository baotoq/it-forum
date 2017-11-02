import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { Thread } from '../../models/thread';
import { API } from '../shared/common/api';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ThreadService {

  constructor(private requestService: RequestService) {
  }

  get(id: number): Observable<Thread> {
    return this.requestService.get(`${API.THREAD.GET}/${id}`);
  }

  create(thread: Thread): Observable<Thread> {
    return this.requestService.authPost(API.THREAD.CREATE, thread);
  }

  increaseView(id: number): Observable<any> {
    return this.requestService.post(`${API.THREAD.VIEW}/${id}`);
  }
}
