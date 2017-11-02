import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';
import { LoadingService } from '../../../components/loading/loading.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  thread: Thread;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private threadService: ThreadService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.threadService.get(this.route.snapshot.params['threadId'])
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.thread = resp;
        this.threadService.increaseView(this.thread.id).subscribe();
      });
  }
}
