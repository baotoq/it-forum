import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Output() selectChange = new EventEmitter<any>();

  navLinks = [
    {label: 'Dashboard', link: '/admin/dashboard', icon: 'dashboard'},
    {label: 'Topics', link: '/admin/topics', icon: 'comments'},
    {label: 'Users', link: '/admin/users', icon: 'users'},
    {label: 'Approve', link: '/admin/approve', icon: 'check'},
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
