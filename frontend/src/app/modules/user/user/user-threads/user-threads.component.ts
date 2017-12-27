import { Component, OnInit } from '@angular/core';
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
export class UserThreadsComponent implements OnInit {
  threads: Thread[];

  currentPage = 1;
  pageSize = 10;
  paginatedData = [];

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private userService: UserService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.progressBarStart();
    this.userService.getUserThreads(this.route.parent.snapshot.params['userId'])
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => {
        this.threads = this.orderByPipe.transform(resp, ['-dateCreated']);
        this.onPageChange();
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.threads.slice(startIndex, startIndex + this.pageSize);
  }
}
