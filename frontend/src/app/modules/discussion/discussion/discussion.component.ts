import { Component, OnInit } from '@angular/core';
import { DiscussionService } from '../discussion.service';
import { Discussion } from '../../../models/discussion';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../shared/loading/loading.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
})
export class DiscussionComponent implements OnInit {
  discussion: Discussion;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private discussionService: DiscussionService) {
  }

  ngOnInit() {
    this.loadDiscussion();
  }

  loadDiscussion() {
    this.loadingService.start();
    this.discussionService.get(this.route.snapshot.params['discussionId'])
      .finally(() => this.loadingService.stop())
      .subscribe(resp => {
        this.discussion = resp;
      });
  }
}
