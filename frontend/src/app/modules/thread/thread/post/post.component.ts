import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  constructor(private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
  }
}
