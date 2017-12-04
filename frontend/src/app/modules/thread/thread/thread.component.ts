import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';
import { LoadingService } from '../../../components/loading/loading.service';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  thread: Thread;
  currentPage = 1;
  pageSize = 3;
  paginatedData = [];

  loading = false;
  onPost = false;
  editorContent;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private threadService: ThreadService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    const threadId = this.route.snapshot.params['threadId'];
    this.threadService.getWithCreatedByTagsAndReplies(threadId)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.thread = resp;
        this.thread.posts = this.orderByPipe.transform(this.thread.posts, ['dateCreated']);
        this.threadService.increaseView(this.thread.id).subscribe();
        this.onPageChange();
      });
  }

  replySuccess($event) {
    this.thread.posts.push($event);
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.thread.posts.slice(startIndex, startIndex + this.pageSize);
  }

  onSubmit() {

  }
}
