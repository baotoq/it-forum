import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../../models/tag';
import { Observable } from 'rxjs/Observable';
import { MatAutocompleteTrigger } from '@angular/material';
import { TagService } from '../../tag/tag.service';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { LoadingService } from '../../../components/loading/loading.service';
import { TopicService } from '../../topic/topic.service';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  form: FormGroup;

  topicOptions: Topic[];

  filteredTags: Observable<Tag[]>;
  selectedTags = [];
  tags: Tag[];
  @ViewChild(MatAutocompleteTrigger) trigger;

  loading = false;

  constructor(private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private topicService: TopicService,
              private tagService: TagService,
              private filterByPipe: FilterByPipe,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    Observable.combineLatest(this.topicService.getAllWithSubTopics(0), this.tagService.getAll())
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.topicOptions = resp[0];
        this.tags = resp[1];
        this.filterTags();
        this.loadingService.spinnerStop();
      });

    this.form = this.formBuilder.group({
      searchString: [null, Validators.required],
      topic: ['-1', Validators.required],
      time: ['-1', Validators.required],
      tags: [null],
    });
  }

  ngOnDestroy() {
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

  get searchString() {
    return this.form.get('searchString');
  }

  get topic() {
    return this.form.get('topic');
  }

  get time() {
    return this.form.get('time');
  }

  get tagsControl() {
    return this.form.get('tags');
  }
}
