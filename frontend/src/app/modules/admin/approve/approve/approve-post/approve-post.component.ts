import { Component, OnInit } from '@angular/core';
import { ApproveService } from '../../approve.service';
import { Post } from '../../../../../models/post';
import { LoadingService } from '../../../../../components/loading/loading.service';
import { OrderByPipe } from 'ngx-pipes';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approve-post',
  templateUrl: './approve-post.component.html',
  styleUrls: ['./approve-post.component.scss'],
})
export class ApprovePostComponent implements OnInit {
  pendingPosts: Post[];

  currentPage = 1;
  pageSize = 20;
  paginatedData = [];

  constructor(private loadingService: LoadingService,
              private approveService: ApproveService,
              private orderByPipe: OrderByPipe,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.approveService.getPendingPosts()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.pendingPosts = this.orderByPipe.transform(resp, ['-dateCreated']);
        this.onPageChange();
      });
  }

  approve(post: Post) {
    this.approveService.approvePost(post.id)
      .subscribe(() => {
        const index = this.pendingPosts.indexOf(post);
        this.pendingPosts.splice(index, 1);
        this.onPageChange();
      });
  }

  decline(post: Post) {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.approveService.declinePost(post.id)
            .subscribe(() => {
              const index = this.pendingPosts.indexOf(post);
              this.pendingPosts.splice(index, 1);
              this.onPageChange();
            });
        }
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.pendingPosts.slice(startIndex, startIndex + this.pageSize);
  }
}
