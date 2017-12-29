import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Tag } from '../../models/tag';
import { API } from '../shared/common/api';

@Injectable()
export class TagService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(API.TAG.URL);
  }

  create(tag: Tag): Observable<any> {
    return this.httpClient.post(API.TAG.URL, tag);
  }

  edit(tag: Tag): Observable<any> {
    return this.httpClient.put(API.TAG.URL, tag);
  }
}
