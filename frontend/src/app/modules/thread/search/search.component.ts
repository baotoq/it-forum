import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchString: string;

  selectedTopic = '-1';
  topicOptions: Topic[];

  tagsControl = new FormControl();
  filteredTags: Observable<Tag[]>;
  selectedTags = [];
  tags: Tag[];
  @ViewChild(MatAutocompleteTrigger) trigger;

  constructor(private loadingService: LoadingService,
              private topicService: TopicService,
              private tagService: TagService,
              private filterByPipe: FilterByPipe,
              private orderByPipe: OrderByPipe) { }

  ngOnInit() {
    Observable.combineLatest(this.topicService.getAllWithSubTopics(0), this.tagService.getAll())
      .subscribe( resp => {
        this.topicOptions = resp[0];
        this.tags = resp[1];
        this.filterTags();
        this.loadingService.spinnerStop();
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
}
