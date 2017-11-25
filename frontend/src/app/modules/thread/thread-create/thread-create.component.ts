import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CoreService } from '../../core/core.service';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';
import { TopicService } from '../../topic/topic.service';
import { DiscussionService } from '../../discussion/discussion.service';
import { LoadingService } from '../../../components/loading/loading.service';
import { TagService } from '../../tag/tag.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import { Tag } from '../../../models/tag';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { MatAutocompleteTrigger } from '@angular/material';


@Component({
  selector: 'app-thread-create',
  templateUrl: './thread-create.component.html',
  styleUrls: ['./thread-create.component.scss'],
})
export class ThreadCreateComponent implements OnInit {
  selectedTopic: number;
  selectedDiscussion: number;

  topicOptions = [];
  discussionOptions = [];

  tagsControl = new FormControl();
  filteredTags: Observable<Tag[]>;
  selectedTags = [];
  tags: Tag[];
  @ViewChild(MatAutocompleteTrigger) trigger;

  loading = false;
  title: string;
  editorContent = '';
  displayPreview = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private authService: AuthService,
              private coreService: CoreService,
              private topicService: TopicService,
              private discussionService: DiscussionService,
              private threadService: ThreadService,
              private tagService: TagService,
              private filterByPipe: FilterByPipe,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.getTopicOptions();
    this.getTags();
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

  getPreviewThread(): Thread {
    return new Thread({
      title: this.title,
      discussionId: this.selectedDiscussion,
      posts: [{content: this.editorContent}],
      user: this.currentUser,
      tags: this.selectedTags,
      createdDate: Date.now(),
    });
  }

  getTopicOptions() {
    this.loadingService.spinnerStart();
    this.topicService.getSelectOptions()
      .flatMap(resp => {
        this.topicOptions = resp;
        this.selectedTopic = +this.route.snapshot.queryParams['topicId'] || this.topicOptions[0].value;
        return this.discussionService.getSelectOptions(this.selectedTopic);
      }).subscribe(resp => {
      this.discussionOptions = resp;
      this.selectedDiscussion = +this.route.snapshot.queryParams['discussionId'] || this.discussionOptions[0].value;
      this.loadingService.spinnerStop();
    });
  }

  getDiscussionOptions() {
    this.loadingService.progressBarStart();
    this.discussionService.getSelectOptions(this.selectedTopic)
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(discussionResp => {
        this.discussionOptions = discussionResp;
        this.selectedDiscussion = this.discussionOptions[0].value;
      });
  }

  getTags() {
    this.tagService.getAll().subscribe(resp => {
      this.tags = resp;
      this.filterTags();
    });
  }

  tagSelected() {
    const value = this.tagsControl.value;
    this.tagsControl.setValue('');
    this.selectedTags.push(value);

    const index = this.tags.indexOf(value);
    this.tags.splice(index, 1);
    this.filterTags();
  }

  tagRemove(tag: any) {
    const index = this.selectedTags.indexOf(tag);
    this.selectedTags.splice(index, 1);

    this.tags.push(tag);
    this.filterTags();
  }

  filterTags() {
    this.tags = this.orderByPipe.transform(this.tags, ['name']);
    this.filteredTags = this.tagsControl.valueChanges.startWith(null)
      .map(val => this.filterByPipe.transform(this.tags, ['name'], val));
  }

  get currentUser() {
    return this.authService.currentUser();
  }
}
