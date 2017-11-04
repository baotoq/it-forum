import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabGroup } from '@angular/material';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: [ConfirmService],
})
export class ConfirmComponent implements OnInit {
  tabs = [
    {label: 'User', link: '/admin/confirm/user'},
    {label: 'Thread', link: '/admin/confirm/thread'},
    {label: 'Post', link: '/admin/confirm/post'},
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
