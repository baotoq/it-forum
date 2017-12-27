import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { User } from '../../../../models/user';
import { LoadingService } from '../../../../components/loading/loading.service';
import { ApproveService } from '../../approve.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ApprovalStatus } from '../../../../models/approval-status';
import { debounce } from '../../../shared/common/decorators';

@Component({
  selector: 'app-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.component.scss'],
})
export class ApproveUserComponent implements OnInit, OnDestroy {
  pendingUsers: User[];

  displayedColumns;

  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  approveLoading = false;

  constructor(private loadingService: LoadingService,
              private approveService: ApproveService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.onResize();
    this.loadingService.spinnerStart();
    this.approveService.getPendingUsers()
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.pendingUsers = resp;
        this.dataSource = new MatTableDataSource(this.pendingUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.matSort;
      });
  }

  ngOnDestroy() {
  }

  filter(searchString: string = '') {
    this.paginator.pageIndex = 0;
    this.dataSource.filter = searchString;
  }

  getSelected() {
    const selected = this.pendingUsers.filter(item => item.approvalStatus === ApprovalStatus.Approved);
    return selected.map(item => item.id);
  }

  onApprove() {
    this.approveLoading = true;
    this.approveService.approveUsers(this.getSelected())
      .finally(() => this.approveLoading = false)
      .subscribe(resp => this.ngOnInit());
  }

  onDecline() {
    this.approveLoading = true;
    this.approveService.declineUsers(this.getSelected())
      .finally(() => this.approveLoading = false)
      .subscribe(resp => this.ngOnInit());
  }

  onDeclineDialog() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.onDecline();
        }
      });
  }

  onApproveAll() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.pendingUsers.forEach(item => item.approvalStatus = ApprovalStatus.Approved);
          this.onApprove();
        }
      });
  }

  onDeclineAll() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.pendingUsers.forEach(item => item.approvalStatus = ApprovalStatus.Approved);
          this.onDecline();
        }
      });
  }

  onClick(value: any) {
    if (value.approvalStatus === ApprovalStatus.Pending)
      value.approvalStatus = ApprovalStatus.Approved;
    else if (value.approvalStatus === ApprovalStatus.Approved)
      value.approvalStatus = ApprovalStatus.Pending;
  }

  @HostListener('window:resize')
  @debounce()
  onResize() {
    if (window.innerWidth < 600) this.displayedColumns = ['email'];
    else if (window.innerWidth < 960) this.displayedColumns = ['email', 'dateCreated'];
    else this.displayedColumns = ['name', 'email', 'dateCreated'];
  }
}
