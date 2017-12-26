import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
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
export class ThreadComponent implements OnInit, OnDestroy {
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
      .takeUntil(componentDestroyed(this))
      .subscribe(resp => {
        this.thread = resp;
        this.checkPermission();
        this.getPosts();
        this.setStorage();
        this.threadService.increaseView(this.thread.id).subscribe();
      });
  }

  ngOnDestroy() {
  }

  getPosts() {
    if (this.thread.approvalStatus === this.approvalStatus.Declined) {
      this.declinedFilter();
    } else if (this.thread.approvalStatus === this.approvalStatus.Pending) {
      if (this.permission) {
        this.pendingFilter();
      } else {
        this.router.navigate(['/']);
      }
    } else {
      if (this.authenticated) {
        if (this.permission || this.authService.isNone()) {
          this.defaultFilter();
        } else if (this.authService.isModerator()) {
          this.approvedFilter();
        }
      } else {
        this.approvedFilter();
      }
    }
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
        this.getPosts();
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
    this.filter(this.threadService.getApprovedPendingPosts(this.thread.id));
  }

  approvedFilter() {
    this.filter(this.threadService.getApprovedPosts(this.thread.id));
  }

  pendingFilter() {
    this.filter(this.threadService.getPendingPosts(this.thread.id));
  }

  declinedFilter() {
    this.filter(this.threadService.getDeclinedPosts(this.thread.id));
  }

  filter(sub) {
    this.loadingService.spinnerStart();
    sub.takeUntil(componentDestroyed(this))
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
