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
import { IsManagementPipe } from '../../shared/pipes/is-management';
import { ApprovalStatus } from '../../../models/approval-status';
import { Role } from '../../../models/role';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  thread: Thread;
  posts: Post[];
  permission = false;

  currentPage = 1;
  pageSize = 10;
  paginatedData = [];

  loading = false;
  showEditor = false;
  editorContent;

  currentUser = this.authService.currentUser();
  authenticated = this.authService.isAuthenticated();

  approvalStatus = ApprovalStatus;
  role = Role;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private coreService: CoreService,
              private authService: AuthService,
              private loadingService: LoadingService,
              private threadService: ThreadService,
              private orderByPipe: OrderByPipe,
              private isManagementPipe: IsManagementPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    const threadId = this.route.snapshot.params['threadId'];
    this.threadService.getWithCreatedByTagsAndReplies(threadId)
      .subscribe(resp => {
        this.thread = resp;
        if (this.thread.approvalStatus === this.approvalStatus.Declined) {
          this.declinedFilter();
        } else {
          this.defaultFilter();
        }
        this.threadService.increaseView(this.thread.id).subscribe();
        this.checkPermission();
        this.setStorage();
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.posts.slice(startIndex, startIndex + this.pageSize);
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
        this.defaultFilter();
        this.coreService.notifySuccess();
      });
  }

  checkPermission() {
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) this.permission = true;
      else this.permission = this.isManagementPipe.transform(this.currentUser, this.thread.topic.managements);
    }
  }

  setStorage() {
    let recentlyThreads = JSON.parse(localStorage.getItem(Storage.RECENTLY_THREADS));
    if (!recentlyThreads) recentlyThreads = [];
    if (!recentlyThreads.some(item => item === this.thread.id))
      recentlyThreads.push(this.thread.id);
    localStorage.setItem(Storage.RECENTLY_THREADS, JSON.stringify(recentlyThreads));
  }

  defaultFilter() {
    this.loadingService.spinnerStart();
    this.threadService.getApprovedPendingPostsWithReplies(this.thread.id)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.posts = this.orderByPipe.transform(resp, ['dateCreated']);
        this.onPageChange();
        this.currentPage = 1;
      });
  }

  approvedFilter() {
    this.loadingService.spinnerStart();
    this.threadService.getApprovedPosts(this.thread.id)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.posts = this.orderByPipe.transform(resp, ['dateCreated']);
        this.onPageChange();
        this.currentPage = 1;
      });
  }

  pendingFilter() {
    this.loadingService.spinnerStart();
    this.threadService.getPendingPosts(this.thread.id)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.posts = this.orderByPipe.transform(resp, ['dateCreated']);
        this.onPageChange();
        this.currentPage = 1;
      });
  }

  declinedFilter() {
    this.loadingService.spinnerStart();
    this.threadService.getDeclinedPosts(this.thread.id)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.posts = this.orderByPipe.transform(resp, ['dateCreated']);
        this.onPageChange();
        this.currentPage = 1;
      });
  }

  threadApprovalChange($event) {
    this.thread.approvalStatus = $event;
  }
}
