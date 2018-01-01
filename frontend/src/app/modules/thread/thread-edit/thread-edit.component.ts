import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CoreService } from '../../core/core.service';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';
import { TopicService } from '../../topic/topic.service';
import { LoadingService } from '../../../components/loading/loading.service';
import { TagService } from '../../tag/tag.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import { Tag } from '../../../models/tag';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { MatAutocompleteTrigger } from '@angular/material';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-thread-edit',
  templateUrl: './thread-edit.component.html',
  styleUrls: ['./thread-edit.component.scss'],
})
export class ThreadEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  thread: Thread;
  post: Post;

  filteredTags: Observable<Tag[]>;
  selectedTags = [];
  tags: Tag[];
  @ViewChild(MatAutocompleteTrigger) trigger;

  loading = false;
  displayPreview = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
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
    this.loadingService.spinnerStart();
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      editorContent: [null, Validators.required],
      tags: [null],
    });
    const id = this.route.snapshot.params['threadId'];
    Observable.combineLatest(
      this.threadService.getWithCreatedByTags(id),
      this.threadService.getThreadContent(id),
      this.tagService.getAll()
    )
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.thread = resp[0];
        if (this.authService.isNone() || this.authService.currentUser().id != this.thread.createdById) {
          this.router.navigate(['/']);
          return;
        }
        this.post = resp[1];
        this.tags = resp[2];
        this.thread.tags.forEach(item => {
          this.selectedTags.push(item);
          const index = this.tags.findIndex(t => t.id === item.id);
          this.tags.splice(index, 1);
        });
        this.filterTags();

        this.title.setValue(this.thread.title);
        this.editorContent.setValue(this.post.content);
      });
  }

  ngOnDestroy() {
  }

  onEdit() {
    this.loading = true;
    const thread = new Thread({
      id: this.thread.id,
      title: this.title.value,
      posts: [{id: this.post.id, content: this.editorContent.value}],
      tags: this.selectedTags,
    });

    this.threadService.edit(thread)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.router.navigate(['/thread', this.thread.id]);
        this.coreService.notifySuccess();
      });
  }

  getPreviewThread(): Thread {
    return new Thread({
      title: this.title.value,
      posts: [{content: this.editorContent.value}],
      createdBy: this.currentUser,
      tags: this.selectedTags,
      createdDate: Date.now(),
    });
  }

  tagSelected() {
    const value = this.form.get('tags').value;
    this.form.get('tags').setValue('');
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
    this.filteredTags = this.form.get('tags').valueChanges.startWith(null)
      .map(val => this.filterByPipe.transform(this.tags, ['name'], val));
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get title() {
    return this.form.get('title');
  }

  get editorContent() {
    return this.form.get('editorContent');
  }
}
