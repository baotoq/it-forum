import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { ApprovalStatus } from '../../../../models/approval-status';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() management = false;

  approvalStatus = ApprovalStatus;

  constructor() {
  }

  ngOnInit() {
  }
}
