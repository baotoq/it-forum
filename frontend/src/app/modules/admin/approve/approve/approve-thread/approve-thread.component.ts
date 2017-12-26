import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Thread } from '../../../../../models/thread';
import { ApproveService } from '../../approve.service';
import { LoadingService } from '../../../../../components/loading/loading.service';
import { OrderByPipe } from 'ngx-pipes';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approve-thread',
  templateUrl: './approve-thread.component.html',
  styleUrls: ['./approve-thread.component.scss'],
})
export class ApproveThreadComponent implements OnInit, OnDestroy {
  pendingThreads: Thread[];

  currentPage = 1;
  pageSize = 20;
  paginatedData = [];

  constructor(private loadingService: LoadingService,
              private approveService: ApproveService,
              private orderByPipe: OrderByPipe,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.approveService.getPendingThreads()
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.pendingThreads = this.orderByPipe.transform(resp, ['-dateCreated']);
        this.onPageChange();
      });
  }

  ngOnDestroy() {
  }

  approve(thread: Thread) {
    this.approveService.approveThread(thread.id)
      .subscribe(() => {
        const index = this.pendingThreads.indexOf(thread);
        this.pendingThreads.splice(index, 1);
        this.onPageChange();
      });
  }

  decline(thread: Thread) {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.approveService.declineThread(thread.id)
            .subscribe(() => {
              const index = this.pendingThreads.indexOf(thread);
              this.pendingThreads.splice(index, 1);
              this.onPageChange();
            });
        }
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.pendingThreads.slice(startIndex, startIndex + this.pageSize);
  }
}
