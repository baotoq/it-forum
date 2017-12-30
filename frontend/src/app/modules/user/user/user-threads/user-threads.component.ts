import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Thread } from '../../../../models/thread';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../components/loading/loading.service';
import { UserService } from '../../user.service';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-user-threads',
  templateUrl: './user-threads.component.html',
  styleUrls: ['./user-threads.component.scss'],
})
export class UserThreadsComponent implements OnInit, OnDestroy {
  threads: Thread[];

  currentPage = 1;
  pageSize = 10;
  paginatedData = [];

  user$;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private userService: UserService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.progressBarStart();
    this.userService.getUserThreads(this.route.parent.snapshot.params['userId'])
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => {
        this.threads = this.orderByPipe.transform(resp, ['-dateCreated']);
        if (this.threads.length > 0) {
          this.user$ = this.userService.get(this.threads[0].createdById);
        }
        this.onPageChange();
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.threads.slice(startIndex, startIndex + this.pageSize);
  }

  ngOnDestroy() {
  }
}
