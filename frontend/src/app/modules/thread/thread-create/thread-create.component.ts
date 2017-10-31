import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CoreService } from '../../core/core.service';
import { ThreadService } from '../thread.service';

import { ENTER } from '@angular/cdk/keycodes';
import { Thread } from '../../../models/thread';
import { TopicService } from '../../topic/topic.service';
import { DiscussionService } from '../../discussion/discussion.service';
import { LoadingService } from '../../../components/loading/loading.service';
import { TagService } from '../../tag/tag.service';

const COMMA = 188;

@Component({
  selector: 'app-thread-create',
  templateUrl: './thread-create.component.html',
  styleUrls: ['./thread-create.component.scss'],
})
export class ThreadCreateComponent implements OnInit {
  tags = [];
  selectedTopic: number;
  selectedDiscussion: number;
  selected = false;

  topicOptions = [];
  discussionOptions = [];

  loading = false;
  title: string;
  editorContent = '';
  displayReview = false;

  separatorKeysCodes = [ENTER, COMMA];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private authService: AuthService,
              private coreService: CoreService,
              private topicService: TopicService,
              private discussionService: DiscussionService,
              private threadService: ThreadService,
              private tagService: TagService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.topicService.getSelectOptions()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(topicResp => {
        this.topicOptions = topicResp;
        this.selectedTopic = +this.route.snapshot.queryParams['topicId'] || this.topicOptions[0].value;

        this.getDiscussionOptions();
      });

    this.tagService.getAll().subscribe(resp => {
      console.log(resp);
    });
  }

  onCreate() {
    this.loading = true;
    const thread = new Thread({
      title: this.title,
      discussionId: this.selectedDiscussion,
      posts: [{content: this.editorContent}],
    });

    this.threadService.create(thread)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.router.navigate(['/thread', resp.id]);
        this.coreService.notifySuccess();
      });
  }

  getDiscussionOptions() {
    this.discussionService.getSelectOptions(this.selectedTopic)
      .subscribe(discussionResp => {
        this.discussionOptions = discussionResp;
        if (this.selected) {
          this.selectedDiscussion = this.discussionOptions[0].value;
        } else {
          this.selectedDiscussion = +this.route.snapshot.queryParams['discussionId'] || this.discussionOptions[0].value;
        }
      });
  }

  add($event): void {
    const input = $event.input;
    const value = $event.value;

    if ((value || '').trim()) this.tags.push({name: value.trim()});
    if (input) input.value = '';
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);
    this.tags.splice(index, 1);
  }

  get currentUser() {
    return this.authService.currentUser();
  }
}
