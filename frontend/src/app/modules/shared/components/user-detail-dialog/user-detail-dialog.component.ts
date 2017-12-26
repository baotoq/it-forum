import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { UserService } from '../../../user/user.service';
import { TopicService } from '../../../topic/topic.service';
import { CoreService } from '../../../core/core.service';
import { Topic } from '../../../../models/topic';
import { Role } from '../../../../models/role';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-detail-dialog',
  templateUrl: './user-detail-dialog.component.html',
  styleUrls: ['./user-detail-dialog.component.scss'],
})
export class UserDetailDialogComponent implements OnInit {
  user: User;
  oldRole: Role;
  topics: Topic[];

  edit = false;
  loading = false;

  role = Role;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private snackBar: MatSnackBar,
              private coreService: CoreService,
              private userService: UserService,
              private topicService: TopicService,
              private dialogRef: MatDialogRef<UserDetailDialogComponent>) {
  }

  ngOnInit() {
    this.edit = false;
    this.loading = false;
    this.userService.getWithManagements(this.data).flatMap(resp => {
      this.user = resp;
      this.oldRole = this.user.role;
      return this.topicService.getAll(1);
    }).subscribe(resp => {
      this.topics = resp;
      this.topics.forEach(item => item.checked = false);

      this.user.managements.forEach(item => {
        const index = this.topics.findIndex(t => t.id === item.topicId);
        if (index >= 0) this.topics[index].checked = true;
      });
    });
  }

  editRole(role: Role) {
    this.edit = true;
    this.user.role = role;
  }

  onCancel() {
    this.ngOnInit();
  }

  onSave() {
    this.loading = true;
    if (this.user.role === this.role.Moderator) {
      const selected = this.topics.filter(item => item.checked);
      this.userService.editRole(this.user.id, this.user.role)
        .flatMap(() => this.userService.editManagements(this.user.id, selected.map(item => item.id)))
        .subscribe(() => {
          this.dialogRef.close(this.user.role);
          this.snackBar.open('Success', '', {duration: 2000});
        });
    } else {
      this.userService.editRole(this.user.id, this.user.role)
        .subscribe(() => {
          this.dialogRef.close(this.user.role);
        });
    }
  }

}
