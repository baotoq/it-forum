import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-avatar',
  template: `
    <a [ngbTooltip]="user.name" [placement]="placement" container="body"
       [routerLink]="['/user', user.id]" class="mr-1 avatar">
      <img [src]="user.avatar" [alt]="user.name" class="img-fluid"
           [style.width.px]="size" [style.height.px]="size">
    </a>
  `,
})
export class UserAvatarComponent implements OnInit {
  @Input() user: User;

  @Input() size = 30;

  @Input() placement = 'right';

  constructor() {
  }

  ngOnInit() {
  }

}
