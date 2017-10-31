import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { Topic } from '../../../models/topic';
import { LoadingService } from '../../../components/loading/loading.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
})
export class TopicListComponent implements OnInit, OnDestroy {
  topics: Topic[];
  subscription: any;

  constructor(private loadingService: LoadingService,
              private topicService: TopicService) {
  }

  ngOnInit() {
    this.getTopic();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTopic() {
    this.loadingService.spinnerStart();
    this.subscription = this.topicService.getAll()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => this.topics = resp);
  }
}
