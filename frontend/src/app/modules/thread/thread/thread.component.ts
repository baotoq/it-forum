import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';
import { LoadingService } from '../../../components/loading/loading.service';
import { OrderByPipe } from 'ngx-pipes';
import { Storage } from '../../shared/common/constant';
import { Post } from '../../../models/post';
import { CoreService } from '../../core/core.service';
import { AuthService } from '../../auth/auth.service';
import { IsExistPipe } from '../../shared/pipes/is-exist.pipe';
import { IsManagementPipe } from '../../shared/pipes/is-management';
import { ApprovalStatus } from '../../../models/approval-status';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  thread: Thread;
  management = false;

  currentPage = 1;
  pageSize = 10;
  paginatedData = [];

  loading = false;
  showEditor = false;
  editorContent;

  currentUser = this.authService.currentUser();

  approvalStatus = ApprovalStatus;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private coreService: CoreService,
              private authService: AuthService,
              private loadingService: LoadingService,
              private threadService: ThreadService,
              private orderByPipe: OrderByPipe,
              private isExistPipe: IsExistPipe,
              private isManagementPipe: IsManagementPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    const threadId = this.route.snapshot.params['threadId'];
    this.threadService.getWithCreatedByTagsAndReplies(threadId)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.thread = resp;
        this.management = this.isManagementPipe.transform(this.currentUser, this.thread.topic.managements);
        this.thread.posts = this.orderByPipe.transform(this.thread.posts, ['dateCreated']);
        this.threadService.increaseView(this.thread.id).subscribe();
        this.onPageChange();
        this.setStorage();
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.thread.posts.slice(startIndex, startIndex + this.pageSize);
  }

  onPost() {
    this.authService.checkLogin();
    this.showEditor = !this.showEditor;
  }

  onSubmit() {
    this.loading = true;
    const post = new Post({
      content: this.editorContent,
      threadId: this.thread.id,
    });

    this.threadService.post(post)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.showEditor = false;
        this.editorContent = '';
        this.coreService.notifySuccess();
        this.thread.posts.push(resp);
        this.onPageChange();
      });
  }

  setStorage() {
    let recentlyThreads = JSON.parse(localStorage.getItem(Storage.RECENTLY_THREADS));
    if (!recentlyThreads) recentlyThreads = [];
    if (!this.isExistPipe.transform(recentlyThreads, this.thread.id))
      recentlyThreads.push(this.thread.id);
    localStorage.setItem(Storage.RECENTLY_THREADS, JSON.stringify(recentlyThreads));
  }
}
