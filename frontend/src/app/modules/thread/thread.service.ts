import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { Thread } from '../../models/thread';
import { Post } from '../../models/post';

@Injectable()
export class ThreadService {

  constructor(private httpClient: HttpClient) {
  }

  getWithCreatedByTagsAndReplies(id: number): Observable<Thread> {
    return this.httpClient.get<Thread>(`${API.THREAD.URL}/created-tags-quotes/${id}`);
  }

  create(thread: Thread): Observable<Thread> {
    return this.httpClient.post<Thread>(API.THREAD.URL, thread);
  }

  post(post: Post): Observable<Post> {
    return this.httpClient.post<Post>(API.POST.URL, post);
  }

  increaseView(id: number): Observable<any> {
    return this.httpClient.post(`${API.THREAD.VIEW}/${id}`, {});
  }
}
