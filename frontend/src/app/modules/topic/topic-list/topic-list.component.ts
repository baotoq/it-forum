import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { Topic } from '../../../models/topic';
import { LoadingService } from '../../../components/loading/loading.service';
import { Storage } from '../../shared/common/constant';

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
      .subscribe(resp => {
        this.topics = resp;

        this.countUnread();
      });
  }

  countUnread() {
    let recentlyThreads = JSON.parse(localStorage.getItem(Storage.RECENTLY_THREADS));
    if (!recentlyThreads) recentlyThreads = [];

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(new Date().getDate() - 3);

    this.topics.forEach(t => {
      t.subTopics.forEach(st => {
        st.numberOfNewThreads = 0;
        st.threads.forEach(th => {
          const d = new Date(th.dateCreated);
          if (d >= threeDaysAgo && !recentlyThreads.some(id => id === th.id)) {
            st.numberOfNewThreads += 1;
          }
        });
      });
    });
  }
}
