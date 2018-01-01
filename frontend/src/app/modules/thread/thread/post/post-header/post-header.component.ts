import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '../../../../../models/role';
import { Post } from '../../../../../models/post';
import { ApprovalStatus } from '../../../../../models/approval-status';
import { AuthService } from '../../../../auth/auth.service';
import { ApproveService } from '../../../../admin/approve.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ThreadService } from '../../../thread.service';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent implements OnInit {
  @Input() post: Post;
  @Input() permission = false;
  @Input() threadApprovalStatus: ApprovalStatus;

  @Output() threadApprovalChange = new EventEmitter<any>();

  role = Role;
  approvalStatus = ApprovalStatus;

  currentUser = this.authService.currentUser();
  authenticated = this.authService.isAuthenticated();

  constructor(private authService: AuthService,
              private approveService: ApproveService,
              private threadService: ThreadService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  approve() {
    if (this.threadApprovalStatus !== this.approvalStatus.Approved) {
      this.approveService.approveThread(this.post.threadId).subscribe(() => {
        this.post.approvalStatus = ApprovalStatus.Approved;
        this.threadApprovalChange.emit(ApprovalStatus.Approved);
      });
    } else {
      this.approveService.approvePost(this.post.id).subscribe(() => {
        this.post.approvalStatus = ApprovalStatus.Approved;
      });
    }
  }

  decline() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          let sub;
          if (this.threadApprovalStatus !== this.approvalStatus.Approved)
            sub = this.approveService.declineThread(this.post.threadId);
          else sub = this.approveService.declinePost(this.post.id);
          sub.subscribe(() => {
            this.post.approvalStatus = ApprovalStatus.Declined;
          });
        }
      });
  }

  delete() {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
         this.threadService.deletePost(this.post.id).subscribe(() => {
            this.post.dateDeleted = new Date();
         });
        }
      });
  }
}
