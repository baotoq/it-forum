import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../../models/post';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../../components/loading/loading.service';
import { CoreService } from '../../../../core/core.service';
import { AuthService } from '../../../../auth/auth.service';
import { ThreadService } from '../../../thread.service';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss'],
})
export class PostContentComponent implements OnInit {
  @Input() post: Post;

  showEditor = false;
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
      content: this.editorContent,
      threadId: this.post.threadId,
      parentId: this.post.id,
    });

    this.threadService.post(post)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.showEditor = false;
        this.editorContent = '';
        this.coreService.notifySuccess();
        this.post.replies.unshift(resp);
      });
  }

  onReply() {
    if (!this.authenticated) {
      this.router.navigate(['/auth/login'],
        {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
      return;
    }
    this.showEditor = !this.showEditor;
  }

  get authenticated() {
    return this.authService.isAuthenticated();
  }
}
