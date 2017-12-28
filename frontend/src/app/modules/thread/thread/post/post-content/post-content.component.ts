import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../../models/post';
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
  @Input() showAction = false;
  @Input() permission = false;
  @Input() locked = false;

  showEditor = false;
  loading = false;
  editorContent: string;

  like = false;
  dislike = false;

  currentUser = this.authService.currentUser();
  authenticated = this.authService.isAuthenticated();

  constructor(private coreService: CoreService,
              private authService: AuthService,
              private threadService: ThreadService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.post.replies = this.orderByPipe.transform(this.post.replies, ['-dateCreated']);

    if (this.post.votes && this.authenticated) {
      this.post.votes.forEach(x => {
        if (x.userId == this.currentUser.id) {
          if (x.like) this.like = true;
          else this.dislike = true;
        }
      });
    }
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
    this.authService.checkLogin();
    this.showEditor = !this.showEditor;
  }

  onVote(like: boolean) {
    this.authService.checkLogin();
    if (this.authenticated && this.post.createdById != this.currentUser.id) {
      this.threadService.vote(this.post.id, like).subscribe(resp => {
        if (resp.message) this.post.point = resp.point;
        if (resp.message === 'up') this.setVote(true, false);
        if (resp.message === 'down') this.setVote(false, true);
        if (resp.message === 'remove') this.setVote(false, false);
      });
    }
  }

  setVote(up: boolean, down: boolean) {
    this.like = up;
    this.dislike = down;
  }
}
