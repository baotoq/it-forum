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
    this.route.params.subscribe(params => {
      this.topicService.get(params['topicId'])
        .subscribe(resp => {
          this.topic = resp;
          this.topic.discussions.forEach(item => {
            this.tabLinks.push(`/topic/${this.topic.id}/discussion/${item.id}`);
          });
          const discussionId = +this.route.firstChild.snapshot.params['discussionId'];
          this.matTabGroup.selectedIndex = this.topic.discussions.findIndex(x => x.id === discussionId);
        });
    });
  }

  focusChange($event) {
    this.router.navigateByUrl(this.tabLinks[$event.index]);
  }
}
