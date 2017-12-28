import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../../models/tag';
import { Observable } from 'rxjs/Observable';
import { MatAutocompleteTrigger, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TagService } from '../../tag/tag.service';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { LoadingService } from '../../../components/loading/loading.service';
import { TopicService } from '../../topic/topic.service';
import { Topic } from '../../../models/topic';
import { ThreadService } from '../thread.service';
import { Thread } from '../../../models/thread';
import { debounce } from '../../shared/common/decorators';

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

  threads: Thread[];
  displayedColumns;
  dataSource: MatTableDataSource<Thread>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private topicService: TopicService,
              private tagService: TagService,
              private threadService: ThreadService,
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
        this.onResize();
      });

    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.matSort.sortChange.subscribe(() => this.sortChange());

    this.form = this.formBuilder.group({
      searchString: [null, Validators.required],
      topic: [null],
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

  onSubmit() {
    this.loading = true;
    const payload = {
      searchString: this.searchString.value,
      topicId: this.topic.value,
      tags: this.selectedTags.map(item => item.id),
    };
    this.threadService.search(payload)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.threads = resp;
        this.sortChange();
      });
  }

  sortChange() {
    const data = this.threads;
    let config = this.matSort.direction === 'asc' ? '+' : '-';
    config += this.matSort.active;
    this.dataSource.data = this.orderByPipe.transform(data, ['-pin', '-approvalStatus', '-numberOfPendings', config]);
  }

  @HostListener('window:resize')
  @debounce()
  onResize() {
    const smallScreen = window.innerWidth < 960;
    if (smallScreen) this.displayedColumns = ['title'];
    else this.displayedColumns = ['title', 'numberOfPosts', 'views', 'lastActivity'];
  }

  get searchString() {
    return this.form.get('searchString');
  }

  get topic() {
    return this.form.get('topic');
  }

  get tagsControl() {
    return this.form.get('tags');
  }
}
