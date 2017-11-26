import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss'],
})
export class ApproveComponent implements OnInit {
  tabs = [
    {label: 'User', link: '/admin/approve/user'},
    {label: 'Thread', link: '/admin/approve/thread'},
    {label: 'Post', link: '/admin/approve/post'},
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
