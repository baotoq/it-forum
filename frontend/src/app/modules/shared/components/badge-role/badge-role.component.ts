import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../../models/role';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-badge-role',
  template: `
    <ng-container *ngIf="user.role !== role.None">
      <span *ngIf="user.role === role.Administrator" class="badge badge-danger badge-line-fix">
        <i class="fa fa-user-circle"></i>
        Admin
      </span>
      <span *ngIf="user.role === role.Moderator" class="badge badge-dark badge-line-fix">
        <i class="fa fa-user-circle"></i>
        Mod
      </span>
    </ng-container>
    <ng-container *ngIf="user.role === role.None">
      <span *ngIf="showNone || newUser" class="badge badge-secondary badge-line-fix">
         <span *ngIf="newUser">New User</span>
         <span *ngIf="showNone">None</span>
      </span>
    </ng-container>
  `,
})
export class BadgeRoleComponent implements OnInit {
  @Input() user: User;
  @Input() showNone = false;
  newUser = false;

  role = Role;

  constructor() {
  }

  ngOnInit() {
    if (!this.showNone) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(new Date().getDate() - 30);
      const d = new Date(this.user.dateCreated);
      if (d >= thirtyDaysAgo) {
        this.newUser = true;
      }
    }
  }
}
