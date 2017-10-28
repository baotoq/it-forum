import { Component, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  topic: Topic;
  tabLinks = [];

  constructor(private route: ActivatedRoute,
              private topicService: TopicService) {
  }

  ngOnInit() {
    this.topicService.get(this.route.snapshot.params['topicId'])
      .subscribe(resp => {
        this.topic = resp;
        this.topic.discussions.forEach(item => {
          this.tabLinks.push({
            label: item.name,
            link: `/topic/${this.topic.id}/discussion/${item.id}`,
          });
        });
      });
  }

}
