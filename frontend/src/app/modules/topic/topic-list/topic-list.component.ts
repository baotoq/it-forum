import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
})
export class TopicListComponent implements OnInit, OnDestroy {
  topics: Topic[];
  subscription: any;
  loading = false;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
    this.getTopic();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTopic() {
    this.loading = true;
    this.subscription = this.topicService.getAll()
      .finally(() => this.loading = false)
      .subscribe(resp => this.topics = resp);
  }
}
