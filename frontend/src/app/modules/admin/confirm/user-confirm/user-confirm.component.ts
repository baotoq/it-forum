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

  displayedColumns = ['check', 'item.name', 'item.email', 'item.createdDate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  behavior = new BehaviorSubject<any[]>([]);
  dataSource: UnconfirmedDataSource;

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
        resp.forEach(item => this.unconfirmed.push({checked: false, item: item}));
        this.unconfirmed = this.orderByPipe.transform(this.unconfirmed, '-item.createdDate');
        this.behavior.next(this.unconfirmed);
        this.dataSource = new UnconfirmedDataSource(this.behavior, this.paginator);
      });

    this.paginator.page.subscribe(() => this.setCheckedAllControl());
  }

  setCheckedAllControl() {
    let checked = true;
    const data = this.behavior.value;
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    for (let i = startIndex; i < startIndex + this.paginator.pageSize; i++) {
      if (data[i]) {
        if (data[i].checked === false) {
          checked = false;
          break;
        }
      }
    }
    if (!data.length) checked = false;
    this.checkedAllControl.setValue(checked);
  }

  checkAllClick() {
    const data = this.behavior.value;
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    for (let i = startIndex; i < startIndex + this.paginator.pageSize; i++) {
      if (data[i]) {
        data[i].checked = this.checkedAllControl.value;
      }
    }
  }

  onSearchOut($event) {
    this.searchString = $event;
    this.filter();
  }

  reload(resp) {
    resp.forEach(item => {
      this.unconfirmed = this.unconfirmed.filter(x => x.item.id !== item);
    });
    this.behavior.next(this.unconfirmed);
    this.checkedAllControl.setValue(false);
  }

  getSelected() {
    this.searchString = '';
    const selected = [];
    this.unconfirmed.forEach(item => {
      if (item.checked === true) selected.push(item.item.id);
    });
    return selected;
  }

  onConfirm() {
    this.loadingService.progressBarStart();
    this.confirmService.confirmUsers(this.getSelected())
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => this.reload(resp));
  }

  onDeny() {
    this.loadingService.progressBarStart();
    this.confirmService.denyUsers(this.getSelected())
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => this.reload(resp));
  }

  getSelectedAll() {
    this.searchString = '';
    const selected = [];
    this.unconfirmed.forEach(item => selected.push(item.item.id));
    return selected;
  }

  reloadAll() {
    this.unconfirmed = [];
    this.behavior.next(this.unconfirmed);
    this.checkedAllControl.setValue(false);
  }

  onConfirmAll() {
    this.loadingService.progressBarStart();
    this.confirmService.confirmUsers(this.getSelectedAll())
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(() => this.reloadAll());
  }

  onDenyAll() {
    this.loadingService.progressBarStart();
    this.confirmService.denyUsers(this.getSelectedAll())
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(() => this.reloadAll());
  }

  filter() {
    const data = this.filterByPipe.transform(this.unconfirmed, ['item.name', 'item.email'], this.searchString);
    this.paginator.pageIndex = 0;
    this.behavior.next(data);
    this.setCheckedAllControl();
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
