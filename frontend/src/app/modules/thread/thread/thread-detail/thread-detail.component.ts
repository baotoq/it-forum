import { Component, Input, OnInit } from '@angular/core';
import { Thread } from '../../../../models/thread';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss'],
})
export class ThreadDetailComponent implements OnInit {
  @Input() thread: Thread;

  constructor() {
  }

  ngOnInit() {
  }

}
