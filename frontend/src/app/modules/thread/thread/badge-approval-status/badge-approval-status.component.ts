import { Component, Input, OnInit } from '@angular/core';
import { ApprovalStatus } from '../../../../models/approval-status';

@Component({
  selector: 'app-badge-approval-status',
  template: `
    <span *ngIf="status === approvalStatus.Pending"
          class="badge badge-warning badge-line-fix text-white"
          matTooltip="Your post need to be approved by the admin">
      {{status}}
    </span>
  `,
})
export class BadgeApprovalStatusComponent implements OnInit {
  @Input() status: ApprovalStatus;

  approvalStatus = ApprovalStatus;

  constructor() {
  }

  ngOnInit() {
  }

}
