import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { TopicService } from '../topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../../../models/topic';
import { MatTabGroup } from '@angular/material';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit, OnDestroy {
  topic: Topic;
  tabLinks = [];

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private topicService: TopicService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.topicService.getWithSubTopics(this.route.snapshot.params['topicId'])
      .takeUntil(componentDestroyed(this))
      .subscribe(resp => {
        this.topic = resp;
        this.topic.subTopics = this.orderByPipe.transform(this.topic.subTopics, 'orderIndex');
        this.topic.subTopics.forEach(item => this.tabLinks.push(`/topic/${this.topic.id}/sub/${item.id}`));
        if (this.route.firstChild) {
          const subTopicId = +this.route.firstChild.snapshot.params['subTopicId'];
          this.matTabGroup.selectedIndex = this.topic.subTopics.findIndex(x => x.id === subTopicId);
        } else {
          this.router.navigateByUrl(this.tabLinks[0]);
        }
      });
  }

  ngOnDestroy() {
  }

  focusChange($event) {
    this.router.navigateByUrl(this.tabLinks[$event.index]);
  }
}
