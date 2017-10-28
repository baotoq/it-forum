import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { DiscussionService } from '../../../discussion/discussion.service';
import { Thread } from '../../../../models/thread';
import { Discussion } from '../../../../models/discussion';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes/esm';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
})
export class DiscussionComponent implements OnInit {
  discussion: Discussion;

  displayedColumns = ['title', 'user.name', 'numberOfPosts', 'views', 'lastActivity'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  behavior = new BehaviorSubject<Thread[]>([]);
  dataSource: ThreadDataSource;

  search = false;
  searchControl = new FormControl();
  @ViewChild('searchInput') searchInput: ElementRef;

  subscription: any;
  loading = false;

  constructor(private route: ActivatedRoute,
              private discussionService: DiscussionService,
              private orderByPipe: OrderByPipe,
              private filterByPipe: FilterByPipe) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchControl.setValue('');
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.loadDiscussion(params['discussionId']);
    });
    this.matSort.sortChange.subscribe(() => this.filter());
  }

  loadDiscussion(id: number) {
    this.loading = true;
    this.subscription = this.discussionService.get(id).delay(1000)
      .finally(() => this.loading = false)
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

  onSearchFocus() {
    this.search = true;
    this.searchInput.nativeElement.focus();
  }

  onSearchOut() {
    this.search = false;
    this.filter();
  }

  filter() {
    const data = this.filterByPipe.transform(this.discussion.threads, ['title'], this.searchControl.value);
    let config = '';
    if (this.matSort.active) {
      config = this.matSort.direction === 'asc' ? '+' : '-';
      config += this.matSort.active;
    }
    this.paginator.pageIndex = 0;
    this.behavior.next(this.orderByPipe.transform(data, config));
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
