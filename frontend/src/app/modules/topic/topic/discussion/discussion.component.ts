import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { DiscussionService } from '../../../discussion/discussion.service';
import { Thread } from '../../../../models/thread';
import { Discussion } from '../../../../models/discussion';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { LoadingService } from '../../../../components/loading/loading.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
})
export class DiscussionComponent implements OnInit {
  discussion: Discussion;
  searchString: string;

  displayedColumns;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  behavior = new BehaviorSubject<Thread[]>([]);
  dataSource: ThreadDataSource;

  constructor(private route: ActivatedRoute,
              private discussionService: DiscussionService,
              private loadingService: LoadingService,
              private orderByPipe: OrderByPipe,
              private filterByPipe: FilterByPipe) {
    this.onResize();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchString = '';
      this.loadDiscussion(params['discussionId']);
    });
    this.matSort.sortChange.subscribe(() => this.filter());
  }

  loadDiscussion(id: number) {
    this.loadingService.spinnerStart();
    this.discussionService.get(id).delay(500)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.discussion = resp;
        this.behavior.next(this.discussion.threads);
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

  onSearchOut($event) {
    this.searchString = $event;
    this.filter();
  }

  filter() {
    const data = this.filterByPipe.transform(this.discussion.threads, ['title'], this.searchString);
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
    if (smallScreen) this.displayedColumns = ['title', 'pinned', 'user.name'];
    else this.displayedColumns = ['title', 'pinned', 'user.name', 'numberOfPosts', 'views', 'lastActivity'];
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
