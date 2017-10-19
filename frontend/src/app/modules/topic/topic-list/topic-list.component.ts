import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
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

  constructor(private topicService: TopicService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.getTopic();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTopic() {
    this.loadingService.start();
    this.subscription = this.topicService.getAll()
      .finally(() => this.loadingService.stop())
      .subscribe(resp => this.topics = resp);
  }
}
