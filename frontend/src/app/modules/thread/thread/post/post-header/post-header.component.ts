import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../../../models/role';
import { Post } from '../../../../../models/post';
import { ApprovalStatus } from '../../../../../models/approval-status';
import { AuthService } from '../../../../auth/auth.service';
import { ApproveService } from '../../../../admin/approve/approve.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent implements OnInit {
  @Input() post: Post;
  @Input() management = false;
  @Input() approveThread = false;

  role = Role;
  approvalStatus = ApprovalStatus;

  currentUser = this.authService.currentUser();
  authenticated = this.authService.isAuthenticated();

  constructor(private authService: AuthService,
              private approveService: ApproveService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  approve(post: Post) {
    let sub;
    if (this.approveThread === true) sub = this.approveService.approveThread(post.threadId);
    else sub = this.approveService.approvePost(post.id);
    sub.subscribe(() => {
      this.post.approvalStatus = ApprovalStatus.Approved;
    });
  }

  decline(post: Post) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        let sub;
        if (this.approveThread === true) sub = this.approveService.declineThread(post.threadId);
        else sub = this.approveService.declinePost(post.id);
        sub.subscribe(() => {
          this.post.approvalStatus = ApprovalStatus.Declined;
        });
      }
    });
  }
}
