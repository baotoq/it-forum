import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { LoadingService } from '../../../../components/loading/loading.service';
import { Thread } from '../../../../models/thread';
import { MatPaginator, MatSort } from '@angular/material';
import { Topic } from '../../../../models/topic';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TopicService } from '../../topic.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Storage } from '../../../shared/common/constant';
import { User } from '../../../../models/user';
import { UserService } from '../../../user/user.service';
import { IsExistPipe } from '../../../shared/pipes/is-exist.pipe';

@Component({
  selector: 'app-sub-topic',
  templateUrl: './sub-topic.component.html',
  styleUrls: ['./sub-topic.component.scss'],
})
export class SubTopicComponent implements OnInit {
  subTopic: Topic;
  searchString: string;

  displayedColumns;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  behavior = new BehaviorSubject<Thread[]>([]);
  dataSource: ThreadDataSource;

  moderators: User[];

  constructor(private route: ActivatedRoute,
              private topicService: TopicService,
              private userService: UserService,
              private loadingService: LoadingService,
              private orderByPipe: OrderByPipe,
              private filterByPipe: FilterByPipe,
              private isExistPipe: IsExistPipe) {
  }

  ngOnInit() {
    this.onResize();
    this.route.params.subscribe(params => {
      this.searchString = '';
      this.getSubTopic(params['subTopicId']);

      this.userService.getModerators(params['subTopicId']).subscribe(resp => {
        this.moderators = resp;
      });
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

        this.behavior.next(this.subTopic.threads);
        if (this.matSort.active !== 'lastActivity') {
          this.matSort.sort({
            id: 'lastActivity',
            start: 'desc',
            disableClear: true,
          });
        }
        this.filter();
        this.dataSource = new ThreadDataSource(this.behavior, this.paginator);
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
    this.searchString = $event;
    this.filter();
  }

  filter() {
    const data = this.filterByPipe.transform(this.subTopic.threads, ['title'], this.searchString);
    let config = '';
    if (this.matSort.active) {
      config = this.matSort.direction === 'asc' ? '+' : '-';
      config += this.matSort.active;
    }
    this.paginator.pageIndex = 0;
    this.behavior.next(this.orderByPipe.transform(data, ['-pinned', config]));
  }

  @HostListener('window:resize')
  onResize() {
    const smallScreen = window.innerWidth < 960;
    if (smallScreen) this.displayedColumns = ['title'];
    else this.displayedColumns = ['title', 'numberOfPosts', 'views', 'lastActivity'];
  }
}

export class ThreadDataSource extends DataSource<any> {
  constructor(private behavior: BehaviorSubject<Thread[]>,
              private paginator: MatPaginator) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Thread[]> {
    const displayDataChanges = [
      this.behavior,
      this.paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.behavior.value.slice();

      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect(collectionViewer: CollectionViewer) {
  }
}

