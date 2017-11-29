///<reference path="../../../../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { LoadingService } from '../../../../components/loading/loading.service';
import { CoreService } from '../../../core/core.service';
import { AuthService } from '../../../auth/auth.service';
import { ThreadService } from '../../thread.service';
import { Router } from '@angular/router';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  onReply = false;
  loading = false;
  editorContent: string;

  constructor(private router: Router,
              private loadingService: LoadingService,
              private coreService: CoreService,
              private authService: AuthService,
              private threadService: ThreadService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.post.replies = this.orderByPipe.transform(this.post.replies, ['-dateCreated']);
  }

  onSubmit() {
    this.loading = true;
    const post = new Post({
      postId: this.post.id,
      content: this.editorContent,
      threadId: this.post.threadId,
    });

    this.threadService.post(post)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.onReply = false;
        this.editorContent = '';
        this.post.replies.unshift(resp);
        this.coreService.notifySuccess();
      });
  }

  replyClick() {
    if (!this.authenticated) {
      this.router.navigate(['/auth/login'],
        {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
      return;
    }
    this.onReply = !this.onReply;
  }

  get authenticated() {
    return this.authService.isAuthenticated();
  }
}
