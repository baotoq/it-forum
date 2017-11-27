import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss'],
})
export class ReplyComponent implements OnInit {
  @Input() reply: Post;

  constructor() {
  }

  ngOnInit() {
  }
}
