import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CoreService } from '../../core/core.service';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';
import { TopicService } from '../../topic/topic.service';
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
export class ThreadCreateComponent implements OnInit, OnDestroy {
  selectedTopic: number;
  topicOptions = [];

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
              private loadingService: LoadingService,
              private authService: AuthService,
              private coreService: CoreService,
              private topicService: TopicService,
              private threadService: ThreadService,
              private tagService: TagService,
              private filterByPipe: FilterByPipe,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    Observable.combineLatest(this.topicService.getAllWithSubTopics(0), this.tagService.getAll())
      .takeUntil(componentDestroyed(this))
      .subscribe(resp => {
        this.topicOptions = resp[0];
        this.tags = resp[1];
        this.filterTags();
        this.loadingService.spinnerStop();
      });
  }

  ngOnDestroy() {
  }

  onCreate() {
    this.loading = true;
    const thread = new Thread({
      title: this.title,
      topicId: this.selectedTopic,
      posts: [{content: this.editorContent}],
      tags: this.selectedTags,
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
      topicId: this.selectedTopic,
      posts: [{content: this.editorContent}],
      createdBy: this.currentUser,
      tags: this.selectedTags,
      createdDate: Date.now(),
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
