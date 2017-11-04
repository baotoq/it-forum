import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '../../../../components/loading/loading.service';
import { ConfirmService } from '../confirm.service';
import { OrderByPipe } from 'ngx-pipes/esm';

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.scss'],
})
export class UserConfirmComponent implements OnInit {
  unconfirmed = [];
  checkedAll = false;

  displayedColumns = ['check', 'item.name', 'item.email', 'item.createdDate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  behavior = new BehaviorSubject<any[]>([]);
  dataSource: UnconfirmedDataSource;

  constructor(private loadingService: LoadingService,
              private confirmService: ConfirmService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.confirmService.getUnconfirmedUser()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        resp.forEach(item => {
          this.unconfirmed.push({checked: false, item: item});
        });
        this.unconfirmed = this.orderByPipe.transform(this.unconfirmed, '-item.createdDate');
        this.behavior.next(this.unconfirmed);
        this.dataSource = new UnconfirmedDataSource(this.behavior, this.paginator);
      });
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
