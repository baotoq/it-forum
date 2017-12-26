import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { ActivatedRoute } from '@angular/router';
import { OrderByPipe } from 'ngx-pipes';
import { LoadingService } from '../../../../components/loading/loading.service';
import { Thread } from '../../../../models/thread';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Topic } from '../../../../models/topic';
import { TopicService } from '../../topic.service';
import { Storage } from '../../../shared/common/constant';
import { User } from '../../../../models/user';
import { UserService } from '../../../user/user.service';
import { ApprovalStatus } from '../../../../models/approval-status';
import { AuthService } from '../../../auth/auth.service';
import { Role } from '../../../../models/role';
import { IsManagementPipe } from '../../../shared/pipes/is-management';
import { ApproveService } from '../../../admin/approve/approve.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs/Observable';
import { ThreadService } from '../../../thread/thread.service';
import { debounce } from '../../../shared/common/decorators';

@Component({
  selector: 'app-sub-topic',
  templateUrl: './sub-topic.component.html',
  styleUrls: ['./sub-topic.component.scss'],
})
export class SubTopicComponent implements OnInit, OnDestroy {
  subTopic: Topic;
  threads = [];

  displayedColumns;
  dataSource: MatTableDataSource<Thread>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  moderators$: Observable<User[]>;

  role = Role;
  approvalStatus = ApprovalStatus;

  currentUser = this.authService.currentUser();
  authenticated = this.authService.isAuthenticated();
  permission = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private topicService: TopicService,
              private threadService: ThreadService,
              private userService: UserService,
              private approveService: ApproveService,
              private loadingService: LoadingService,
              private orderByPipe: OrderByPipe,
              private isManagementPipe: IsManagementPipe,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.onResize();
    this.route.params.subscribe(params => {
      this.getSubTopic(params['subTopicId']);

      this.moderators$ = this.userService.getModerators(params['subTopicId']).takeUntil(componentDestroyed(this));
      this.paginator.pageIndex = 0;
    });
    this.matSort.sortChange.subscribe(() => this.search());
  }

  ngOnDestroy() {
  }

  getSubTopic(id: number) {
    this.loadingService.spinnerStart();
    this.topicService.getWithManagements(id)
      .takeUntil(componentDestroyed(this))
      .subscribe(resp => {
        this.subTopic = resp;

        this.highlightRecently();

        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;

        if (this.authenticated && this.currentUser.role !== this.role.None) {
          this.approvedFilter();
        } else {
          this.approvedAndPendingFilter();
        }

        if (this.matSort.active !== 'lastActivity') {
          this.matSort.sort({id: 'lastActivity', start: 'desc', disableClear: true});
        }

        if (this.authService.isAuthenticated()) {
          if (this.authService.isAdmin()) this.permission = true;
          else this.permission = this.isManagementPipe.transform(this.currentUser, this.subTopic.managements);
        }
      });
  }

  highlightRecently() {
    let recentlyThreads = JSON.parse(localStorage.getItem(Storage.RECENTLY_THREADS));
    if (!recentlyThreads) recentlyThreads = [];

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(new Date().getDate() - 3);

    this.subTopic.threads.forEach(th => {
      const d = new Date(th.dateCreated);
      if (d >= threeDaysAgo && !recentlyThreads.some(id => id === th.id)) {
        th.highlight = true;
      }
    });
  }

  onSearchOut($event) {
    this.search($event);
  }

  search(searchString: string = '') {
    const data = this.threads;
    let config = this.matSort.direction === 'asc' ? '+' : '-';
    config += this.matSort.active;
    this.dataSource.data = this.orderByPipe.transform(data, ['-pin', '-approvalStatus', '-numberOfPendings', config]);
    this.dataSource.filter = searchString.trim().toLowerCase();
  }

  @HostListener('window:resize')
  @debounce()
  onResize() {
    const smallScreen = window.innerWidth < 960;
    if (smallScreen) this.displayedColumns = ['title'];
    else this.displayedColumns = ['title', 'numberOfPosts', 'views', 'lastActivity'];
  }

  approve(thread: Thread) {
    this.approveService.approveThread(thread.id)
      .subscribe(() => {
        thread.approvalStatus = ApprovalStatus.Approved;
        thread.numberOfPendings = 0;
      });
  }

  decline(thread: Thread) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.approveService.declineThread(thread.id)
          .subscribe(() => {
            thread.approvalStatus = ApprovalStatus.Declined;
          });
      }
    });
  }

  pin(thread: Thread, pin: boolean) {
    this.threadService.pin(thread.id, pin).subscribe(resp => {
      thread.pin = pin;
    });
  }

  approvedAndPendingFilter() {
    this.filter(this.topicService.getApprovedAndPendingThreads(this.subTopic.id));
  }

  approvedFilter() {
    this.filter(this.topicService.getApprovedThreads(this.subTopic.id));
  }

  pendingFilter() {
    this.filter(this.topicService.getPendingThreads(this.subTopic.id));
  }

  declinedFilter() {
    this.filter(this.topicService.getDeclinedThreads(this.subTopic.id));
  }

  filter(sub) {
    this.loadingService.spinnerStart();
    sub.takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.threads = resp;
        this.paginator.pageIndex = 0;
        this.search();
      });
  }
}
