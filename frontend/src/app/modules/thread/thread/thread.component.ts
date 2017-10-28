import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  thread: Thread;

  constructor(private route: ActivatedRoute,
              private threadService: ThreadService) {
  }

  ngOnInit() {
    this.threadService.get(this.route.snapshot.params['threadId'])
      .subscribe(resp => {
        this.thread = resp;
      });
  }
}
