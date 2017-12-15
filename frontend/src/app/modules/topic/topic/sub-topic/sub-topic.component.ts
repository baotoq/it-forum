import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { IsExistPipe } from '../../../shared/pipes/is-exist.pipe';
import { ApprovalStatus } from '../../../../models/approval-status';
import { AuthService } from '../../../auth/auth.service';
import { Role } from '../../../../models/role';
import { IsManagementPipe } from '../../../shared/pipes/is-management';
import { ApproveService } from '../../../admin/approve/approve.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs/Observable';
import { ThreadService } from '../../../thread/thread.service';

@Component({
  selector: 'app-sub-topic',
  templateUrl: './sub-topic.component.html',
  styleUrls: ['./sub-topic.component.scss'],
})
export class SubTopicComponent implements OnInit {
  subTopic: Topic;

  displayedColumns;
  dataSource: MatTableDataSource<Thread>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  $moderators: Observable<User[]>;

  role = Role;
  approvalStatus = ApprovalStatus;

  currentUser = this.authService.currentUser();
  authenticated = this.authService.isAuthenticated();
  management = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private topicService: TopicService,
              private threadService: ThreadService,
              private userService: UserService,
              private approveService: ApproveService,
              private loadingService: LoadingService,
              private orderByPipe: OrderByPipe,
              private isExistPipe: IsExistPipe,
              private isManagementPipe: IsManagementPipe,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.onResize();
    this.route.params.subscribe(params => {
      this.getSubTopic(params['subTopicId']);

      this.$moderators = this.userService.getModerators(params['subTopicId']);
      this.paginator.pageIndex = 0;
    });
    this.matSort.sortChange.subscribe(() => this.filter());
  }

  getSubTopic(id: number) {
    this.loadingService.spinnerStart();
    this.topicService.getWithThreads(id)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.subTopic = resp;

        this.highlightRecently();

        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.filter();

        if (this.matSort.active !== 'lastActivity') {
          this.matSort.sort({id: 'lastActivity', start: 'desc', disableClear: true});
        }

        this.management = this.isManagementPipe.transform(this.currentUser, this.subTopic.managements);
      });
  }

  highlightRecently() {
    const recentlyThreads = JSON.parse(localStorage.getItem(Storage.RECENTLY_THREADS));

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(new Date().getDate() - 3);

    this.subTopic.threads.forEach(th => {
      const d = new Date(th.dateCreated);
      if (d >= threeDaysAgo && !this.isExistPipe.transform(recentlyThreads, th.id)) {
        th.highlight = true;
      }
    });
  }

  onSearchOut($event) {
    this.filter($event);
  }

  filter(searchString: string = '') {
    const data = this.subTopic.threads;
    let config = this.matSort.direction === 'asc' ? '+' : '-';
    config += this.matSort.active;
    this.dataSource.data = this.orderByPipe.transform(data, ['-pin', config]);
    this.dataSource.filter = searchString.trim().toLowerCase();
  }

  @HostListener('window:resize')
  onResize() {
    const smallScreen = window.innerWidth < 960;
    if (smallScreen) this.displayedColumns = ['title'];
    else this.displayedColumns = ['title', 'numberOfPosts', 'views', 'lastActivity'];
  }

  approve(thread: Thread) {
    this.approveService.approveThread(thread.id)
      .subscribe(() => {
        thread.approvalStatus = ApprovalStatus.Approved;
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
}
