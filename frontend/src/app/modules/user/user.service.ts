import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { User } from '../../models/user';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  get(id: number): Observable<User> {
    return this.httpClient.get<User>(`${API.USER.URL}/${id}`);
  }

  getModerators(topicId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${API.USER.URL}/moderators/${topicId}`);
  }
}
