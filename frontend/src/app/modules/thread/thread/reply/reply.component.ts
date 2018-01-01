import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { Role } from '../../../../models/role';
import { ApprovalStatus } from '../../../../models/approval-status';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ApproveService } from '../../../admin/approve.service';
import { MatDialog } from '@angular/material';
import { ThreadService } from '../../thread.service';
import { AuthService } from '../../../auth/auth.service';
import { EditPostDialogComponent } from '../../edit-post-dialog/edit-post-dialog.component';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss'],
})
export class ReplyComponent implements OnInit {
  @Input() reply: Post;
  @Input() permission = false;

  role = Role;
  currentUser = this.authService.currentUser();
  authenticated = this.authService.isAuthenticated();
  approvalStatus = ApprovalStatus;

  constructor(private authService: AuthService,
              private approveService: ApproveService,
              private threadService: ThreadService,
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

  delete() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
         this.threadService.deletePost(this.reply.id).subscribe(() => {
            this.reply.dateDeleted = new Date();
         });
        }
      });
  }

  edit() {
    this.dialog.open(EditPostDialogComponent, {
      data: this.reply, width: '800px'
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          this.reply.content = result.content;
          this.reply.dateModified = new Date();
        }
      });
  }
}
