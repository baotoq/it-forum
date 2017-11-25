import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { Tag } from '../../models/tag';
import { API } from '../shared/common/api';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TagService {

  constructor(private requestService: RequestService) {
  }

  getAll(): Observable<Tag[]> {
    return this.requestService.get(API.TAG.URL);
  }
}
