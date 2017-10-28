import { Component, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {

  tabLinks = [
    {label: 'Discussion1', link: '/topic/discussion/162'},
    {label: 'Discussion2', link: '/topic/discussion/187'},
    {label: 'Discussion3', link: '/topic/discussion/186'},
  ];

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
  }

}
