import { Component, Input, OnInit } from '@angular/core';
import { ApprovalStatus } from '../../../../models/approval-status';

@Component({
  selector: 'app-badge-approval-status',
  template: `
    <span *ngIf="status === approvalStatus.Pending"
          class="badge badge-warning badge-line-fix text-white"
          matTooltip="This post is waiting to be approved" matTooltipPosition="above">
      {{status}}
    </span>
    <span *ngIf="status === approvalStatus.Declined"
          class="badge badge-danger badge-line-fix">
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
