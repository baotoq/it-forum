import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { LoadingService } from '../../../../components/loading/loading.service';
import { CoreService } from '../../../core/core.service';
import { AuthService } from '../../../auth/auth.service';
import { ThreadService } from '../../thread.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  reply = false;
  loading = false;
  editorContent: string;

  constructor(private router: Router,
              private loadingService: LoadingService,
              private coreService: CoreService,
              private authService: AuthService,
              private threadService: ThreadService) {
  }

  ngOnInit() {
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
        this.reply = false;
        this.post.replies.unshift(resp);
        this.editorContent = '';
        this.coreService.notifySuccess();
      });
  }

  onReply() {
    if (!this.authenticated) {
      this.router.navigate(['/auth/login'],
        {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
      return;
    }
    this.reply = !this.reply;
  }

  get authenticated() {
    return this.authService.isAuthenticated();
  }
}
