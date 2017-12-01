import { Injectable } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { Observable } from 'rxjs/Observable';
import { API } from '../shared/common/api';
import { Thread } from '../../models/thread';
import { Post } from '../../models/post';

@Injectable()
export class ThreadService {

  constructor(private requestService: RequestService) {
  }

  getWithCreatedByTagsAndReplies(id: number): Observable<Thread> {
    return this.requestService.get(`${API.THREAD.URL}/created-tags-quotes/${id}`);
  }

  create(thread: Thread): Observable<Thread> {
    return this.requestService.authPost(API.THREAD.URL, thread);
  }

  post(post: Post): Observable<Post> {
    return this.requestService.authPost(API.POST.URL, post);
  }

  increaseView(id: number): Observable<any> {
    return this.requestService.post(`${API.THREAD.VIEW}/${id}`);
  }
}
