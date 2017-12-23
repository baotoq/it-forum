import { Component, OnInit } from '@angular/core';
import { Topic } from '../../../models/topic';
import { LoadingService } from '../../../components/loading/loading.service';
import { MatDialog } from '@angular/material';
import { CreateTopicDialogComponent } from './create-topic-dialog/create-topic-dialog.component';
import { TopicService } from '../../topic/topic.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-topic',
  templateUrl: './manage-topic.component.html',
  styleUrls: ['./manage-topic.component.scss'],
})
export class ManageTopicComponent implements OnInit {
  topics: Topic[];

  constructor(private loadingService: LoadingService,
              private topicService: TopicService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.topicService.getAllWithSubTopics(0)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.topics = resp;
      });
  }

  createSub(topic: Topic) {
    this.dialog.open(CreateTopicDialogComponent, {
      data: topic,
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          topic.subTopics.push(result);
        }
      });
  }

  deleteTopic(topic: Topic) {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.loadingService.progressBarStart();
          this.topicService.delete(topic.id)
            .finally(() => this.loadingService.progressBarStop())
            .subscribe(() => {
              const index = this.topics.indexOf(topic);
              if (index === -1) {
                const t = this.topics.find(item => item.id === topic.parentId);
                t.subTopics.splice(index, 1);
              } else {
                this.topics.splice(index, 1);
              }
            });
        }
      });
  }
}
