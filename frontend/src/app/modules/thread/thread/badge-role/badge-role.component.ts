import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../../models/role';

@Component({
  selector: 'app-badge-role',
  template: `
    <span *ngIf="role !== r.None"
          class="badge badge-danger badge-line-fix">
      <i class="fa fa-user-circle"></i>
      <span *ngIf="short">Admin</span>
      <span *ngIf="!short">{{inputRole}}</span>
    </span>
  `,
})
export class BadgeRoleComponent implements OnInit {
  @Input() role: Role;
  @Input() short = false;

  r = Role;

  constructor() {
  }

  ngOnInit() {
  }
}
