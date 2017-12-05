import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../../../models/user';
import { LoadingService } from '../../../../../components/loading/loading.service';
import { ApproveService } from '../../approve.service';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.component.scss'],
})
export class ApproveUserComponent implements OnInit {
  unapprove: User[];
  checkedAllControl = new FormControl(false);
  searchString: string;

  displayedColumns = ['check', 'name', 'email', 'dateCreated'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  behavior = new BehaviorSubject<any[]>([]);
  dataSource: UnapproveDataSource;

  approveLoading = false;

  constructor(private loadingService: LoadingService,
              private approveService: ApproveService,
              private filterByPipe: FilterByPipe,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.approveService.getUnapproveUsers()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.unapprove = this.orderByPipe.transform(resp, '-dateCreated');
        this.behavior.next(this.unapprove);
        this.dataSource = new UnapproveDataSource(this.behavior, this.paginator);
      });
    this.checkedAllControl.setValue(false);
  }

  checkAllClick() {
    const data = this.behavior.value;
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    for (let i = startIndex; i < startIndex + this.paginator.pageSize; i++) {
      if (data[i]) {
        data[i].selected = this.checkedAllControl.value;
      }
    }
  }

  onSearchOut($event) {
    this.searchString = $event;
    this.filter();
  }

  getSelected() {
    this.searchString = '';
    const selected = this.unapprove.filter(item => item.selected === true);
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

  onApproveAll() {
    this.unapprove.forEach(item => item.selected = true);
    this.onApprove();
  }

  onDeclineAll() {
    this.unapprove.forEach(item => item.selected = true);
    this.onDecline();
  }

  filter() {
    const data = this.filterByPipe.transform(this.unapprove, ['name', 'email'], this.searchString);
    this.paginator.pageIndex = 0;
    this.behavior.next(data);
  }
}

export class UnapproveDataSource extends DataSource<any> {
  constructor(private behavior: BehaviorSubject<any[]>,
              private paginator: MatPaginator) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
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
