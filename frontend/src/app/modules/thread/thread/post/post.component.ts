///<reference path="../../../../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../../../models/post';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() replySuccess = new EventEmitter<any>();

  constructor(private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.post.quotes = this.orderByPipe.transform(this.post.quotes, ['-dateCreated']);
  }
}
