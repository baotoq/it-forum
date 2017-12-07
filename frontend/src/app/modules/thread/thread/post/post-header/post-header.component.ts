import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../../../models/role';
import { Post } from '../../../../../models/post';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent implements OnInit {
  @Input() post: Post;

  role = Role;

  constructor() {
  }

  ngOnInit() {
  }

}
