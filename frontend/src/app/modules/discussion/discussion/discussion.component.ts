import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
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
  behavior = new BehaviorSubject<Thread[]>([]);
  dataSource: ThreadDataSource;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private discussionService: DiscussionService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadDiscussion();
  }

  loadDiscussion() {
    this.loadingService.start();
    this.discussionService.get(this.route.snapshot.params['discussionId'])
      .finally(() => this.loadingService.stop())
      .subscribe(resp => {
        this.discussion = resp;
        this.behavior.next(this.orderByPipe.transform(this.discussion.threads, '-lastActivity'));
        this.dataSource = new ThreadDataSource(this.behavior, this.paginator);
      });
  }
}

export class ThreadDataSource extends DataSource<any> {
  constructor(private behavior: BehaviorSubject<Thread[]>, private paginator: MatPaginator) {
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

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
