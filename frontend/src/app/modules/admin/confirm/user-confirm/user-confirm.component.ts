import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '../../../../components/loading/loading.service';
import { ConfirmService } from '../confirm.service';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.scss'],
})
export class UserConfirmComponent implements OnInit {
  unconfirmed = [];
  checkedAllControl = new FormControl(false);
  searchString: string;

  displayedColumns = ['check', 'name', 'email', 'dateCreated'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  behavior = new BehaviorSubject<any[]>([]);
  dataSource: UnconfirmedDataSource;

  confirmLoading = false;

  constructor(private loadingService: LoadingService,
              private confirmService: ConfirmService,
              private filterByPipe: FilterByPipe,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.confirmService.getUnconfirmedUser()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.unconfirmed = this.orderByPipe.transform(resp, '-dateCreated');
        this.behavior.next(this.unconfirmed);
        this.dataSource = new UnconfirmedDataSource(this.behavior, this.paginator);
      });

    this.paginator.page.subscribe(() => this.checkedAllControl.setValue(false));
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
    const selected = this.unconfirmed.filter(item => item.selected === true);
    return selected.map(item => item.id);
  }

  onConfirm() {
    this.confirmLoading = true;
    this.confirmService.confirmUsers(this.getSelected())
      .finally(() => this.confirmLoading = false)
      .subscribe(resp => this.ngOnInit());
  }

  onDeny() {
    this.confirmLoading = true;
    this.confirmService.denyUsers(this.getSelected())
      .finally(() => this.confirmLoading = false)
      .subscribe(resp => this.ngOnInit());
  }

  onConfirmAll() {
    this.unconfirmed.forEach(item => item.selected = true);
    this.onConfirm();
  }

  onDenyAll() {
    this.unconfirmed.forEach(item => item.selected = true);
    this.onDeny();
  }

  filter() {
    const data = this.filterByPipe.transform(this.unconfirmed, ['name', 'email'], this.searchString);
    this.paginator.pageIndex = 0;
    this.behavior.next(data);
  }
}

export class UnconfirmedDataSource extends DataSource<any> {
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
