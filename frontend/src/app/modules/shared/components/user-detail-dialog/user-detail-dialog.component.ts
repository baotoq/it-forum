import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../../models/user';
import { UserService } from '../../../user/user.service';
import { Role } from '../../../../models/role';
import { TopicService } from '../../../topic/topic.service';
import { Topic } from '../../../../models/topic';
import { Management } from '../../../../models/management';

@Component({
  selector: 'app-user-detail-dialog',
  templateUrl: './user-detail-dialog.component.html',
  styleUrls: ['./user-detail-dialog.component.scss'],
})
export class UserDetailDialogComponent implements OnInit {
  user: User;
  topics: Topic[];
  displayTopics: Topic[];

  edit = false;
  loading = false;

  role = Role;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private userService: UserService,
              private topicService: TopicService) {
  }

  ngOnInit() {
    this.userService.getWithManagements(this.data).flatMap(resp => {
      this.user = resp;
      return this.topicService.getAllSubTopics();
    }).subscribe(resp => {
      this.topics = resp;
      this.topics.forEach(item => item.checked = false);

      this.user.managements.forEach(item => {
        const index = this.topics.findIndex(t => t.id === item.topicId);
        if (index >= 0) this.topics[index].checked = true;
      });

      this.displayTopics = this.topics.map(x => Object.assign({}, x));
    });
  }

  editRole(role: Role) {
    this.userService.editRole(this.user.id, role).subscribe(() => {
      this.user.role = role;
    });
  }

  onCancel() {
    this.edit = false;
    this.displayTopics = this.topics.map(x => Object.assign({}, x));
  }

  onSave() {
    this.loading = true;
    const selected = this.displayTopics.filter(item => item.checked);
    this.userService.editManagements(this.user.id, selected.map(item => item.id))
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.edit = false;
      });
  }
}
