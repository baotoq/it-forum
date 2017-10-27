import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { DiscussionService } from '../discussion.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { Thread } from '../../../models/thread';
import { Discussion } from '../../../models/discussion';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { OrderByPipe } from 'ngx-pipes/esm';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
})
export class DiscussionComponent implements OnInit {
  discussion: Discussion;

  displayedColumns = ['title', 'user', 'numberOfPosts', 'views', 'lastActivity'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  behavior = new BehaviorSubject<Thread[]>([]);
  dataSource: ThreadDataSource;

  search = false;
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private discussionService: DiscussionService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadDiscussion();
    this.onSort().subscribe();
  }

  loadDiscussion() {
    this.loadingService.start();
    this.discussionService.get(this.route.snapshot.params['discussionId'])
      .finally(() => this.loadingService.stop())
      .subscribe(resp => {
        this.discussion = resp;
        this.behavior.next(this.discussion.threads);
        this.sort.sort({
          id: 'lastActivity',
          start: 'desc',
          disableClear: true,
        });
        this.dataSource = new ThreadDataSource(this.behavior, this.paginator);
      });
  }

  onSearch() {
    this.search = !this.search;
    this.searchInput.nativeElement.focus();
  }

  onSearchOut() {
    this.search = !this.search;
  }

  onSort() {
    return Observable.merge(this.sort.sortChange).map(() => {
      let config = '';
      if (this.sort.active) {
        config = this.sort.direction === 'asc' ? '+' : '-';
        config += this.sort.active;
      }
      this.paginator.pageIndex = 0;
      this.behavior.next(this.orderByPipe.transform(this.discussion.threads, config));
    });
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
