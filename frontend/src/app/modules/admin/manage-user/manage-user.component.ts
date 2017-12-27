import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageUserService } from './manage-user.service';
import { User } from '../../../models/user';
import { MatTabGroup } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
  providers: [ManageUserService],
})
export class ManageUserComponent implements OnInit {
  tabs = [
    {label: 'User', link: '/admin/users'},
    {label: 'Approve', link: '/admin/users/approve'},
  ];
  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.matTabGroup.selectedIndex = this.tabs.findIndex(x => x.link === this.router.url);
  }

  focusChange($event) {
    this.router.navigate([this.tabs[$event.index].link]);
  }
}
