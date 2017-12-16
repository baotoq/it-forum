import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ManageUserService } from './manage-user.service';
import { User } from '../../../models/user';
import { LoadingService } from '../../../components/loading/loading.service';
import { debounce } from '../../shared/common/decorators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

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
              private manageUserService: ManageUserService) {
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
}
