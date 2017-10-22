import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { Discussion } from '../../models/discussion';
import { API } from '../shared/common/api';

@Injectable()
export class DiscussionService {

  constructor(private requestService: RequestService) {
  }

  get(id: number): Observable<Discussion> {
    return this.requestService.get(`${API.DISCUSSION.GET}/${id}`);
  }
}
