import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
})
export class QuoteComponent implements OnInit {
  @Input() quote: Post;

  constructor() {
  }

  ngOnInit() {
  }

}
