import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { User } from '../../../../models/user';
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
  users: User[];
  checkedAll = false;

  displayedColumns = ['checked', 'name', 'email'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  behavior = new BehaviorSubject<User[]>([]);
  dataSource: UnconfirmedUserDataSource;

  constructor(private loadingService: LoadingService,
              private confirmService: ConfirmService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.confirmService.getUnconfirmedUser()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.users = resp;
        this.users.forEach(item => (item as any).checked = false);
        this.users = this.orderByPipe.transform(this.users, 'name');
        this.behavior.next(this.users);
        this.dataSource = new UnconfirmedUserDataSource(this.behavior, this.paginator);
      });
  }
}

export class UnconfirmedUserDataSource extends DataSource<any> {
  constructor(private behavior: BehaviorSubject<User[]>,
              private paginator: MatPaginator) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
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
