import { Component, Input, OnInit } from '@angular/core';
import { Thread } from '../../../../models/thread';

@Component({
  selector: 'app-thread-preview',
  templateUrl: './thread-preview.component.html',
  styleUrls: ['./thread-preview.component.scss'],
})
export class ThreadPreviewComponent implements OnInit {
  @Input() thread: Thread;

  constructor() {
  }

  ngOnInit() {
  }

}
