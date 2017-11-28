import { Component, OnInit, ViewChild } from '@angular/core';
import { TopicService } from '../topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../../../models/topic';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  topic: Topic;
  tabLinks = [];

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private topicService: TopicService) {
  }

  ngOnInit() {
    this.topicService.getWithSubTopics(this.route.snapshot.params['topicId'])
      .subscribe(resp => {
        this.topic = resp;
        this.topic.subTopics.forEach(item => this.tabLinks.push(`/topic/${this.topic.id}/sub/${item.id}`));
        const subTopicId = +this.route.firstChild.snapshot.params['subTopicId'];
        this.matTabGroup.selectedIndex = this.topic.subTopics.findIndex(x => x.id === subTopicId);
      });
  }

  focusChange($event) {
    this.router.navigateByUrl(this.tabLinks[$event.index]);
  }
}
