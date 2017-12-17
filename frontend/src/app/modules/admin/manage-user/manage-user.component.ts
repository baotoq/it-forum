import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ManageUserService } from './manage-user.service';
import { User } from '../../../models/user';
import { LoadingService } from '../../../components/loading/loading.service';
import { debounce } from '../../shared/common/decorators';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserDetailDialogComponent } from '../../shared/components/user-detail-dialog/user-detail-dialog.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
  providers: [ManageUserService],
})
export class ManageUserComponent implements OnInit {
  users: User[];
  displayedColumns;

  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private loadingService: LoadingService,
              private manageUserService: ManageUserService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.onResize();
    this.loadingService.spinnerStart();
    this.manageUserService.getApprovedUser()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.users = resp;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.matSort;
      });
  }

  @HostListener('window:resize')
  @debounce()
  onResize() {
    if (window.innerWidth < 600) this.displayedColumns = ['email', 'role'];
    else if (window.innerWidth < 960) this.displayedColumns = ['email', 'role', 'dateCreated'];
    else this.displayedColumns = ['name', 'email', 'role', 'dateCreated'];
  }

  filter(searchString: string = '') {
    this.paginator.pageIndex = 0;
    this.dataSource.filter = searchString;
  }

  viewDetail(user: User) {
    this.dialog.open(UserDetailDialogComponent, {
      data: {
        user: user,
      },
      width: '600px',
    });
  }
}
