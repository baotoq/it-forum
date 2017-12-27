import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { TopicService } from '../topic.service';
import { Topic } from '../../../models/topic';
import { LoadingService } from '../../../components/loading/loading.service';
import { Storage } from '../../shared/common/constant';
import { UserService } from '../../user/user.service';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { ApprovalStatus } from '../../../models/approval-status';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
})
export class TopicListComponent implements OnInit, OnDestroy {
  topics: Topic[];

  constructor(private loadingService: LoadingService,
              private topicService: TopicService,
              private userService: UserService,
              private filterByPipe: FilterByPipe,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.getTopic();
  }

  ngOnDestroy() {
  }

  getTopic() {
    this.loadingService.spinnerStart();
    this.topicService.getAllWithSubTopicsAndThreads(0)
      .finally(() => this.loadingService.spinnerStop())
      .takeUntil(componentDestroyed(this))
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
        st.threads = this.filterByPipe.transform(st.threads, ['approvalStatus'], ApprovalStatus.Approved);
        st.threads = this.orderByPipe.transform(st.threads, ['-lastActivity']);
        if (st.threads.length >= 1) {
          st.threads[0].createdBy$ = this.userService.get(st.threads[0].createdById);
        }
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
