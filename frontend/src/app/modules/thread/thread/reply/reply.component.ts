import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { Role } from '../../../../models/role';
import { ApprovalStatus } from '../../../../models/approval-status';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ApproveService } from '../../../admin/approve.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss'],
})
export class ReplyComponent implements OnInit {
  @Input() reply: Post;
  @Input() permission = false;

  role = Role;
  approvalStatus = ApprovalStatus;

  constructor(private approveService: ApproveService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  approve() {
    this.approveService.approvePost(this.reply.id).subscribe(() => {
      this.reply.approvalStatus = ApprovalStatus.Approved;
    });
  }

  decline() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.approveService.declinePost(this.reply.id).subscribe(() => {
            this.reply.approvalStatus = ApprovalStatus.Declined;
          });
        }
      });
  }
}
