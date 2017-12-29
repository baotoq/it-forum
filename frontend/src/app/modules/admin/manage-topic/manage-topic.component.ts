import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Topic } from '../../../models/topic';
import { LoadingService } from '../../../components/loading/loading.service';
import { MatDialog } from '@angular/material';
import { CreateTopicDialogComponent } from './create-topic-dialog/create-topic-dialog.component';
import { TopicService } from '../../topic/topic.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditTopicDialogComponent } from './edit-topic-dialog/edit-topic-dialog.component';
import { OrderByPipe } from 'ngx-pipes';
import { CoreService } from '../../core/core.service';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';

@Component({
  selector: 'app-manage-topic',
  templateUrl: './manage-topic.component.html',
  styleUrls: ['./manage-topic.component.scss'],
})
export class ManageTopicComponent implements OnInit, OnDestroy {
  topics: Topic[];

  reorder = false;

  constructor(private loadingService: LoadingService,
              private coreService: CoreService,
              private topicService: TopicService,
              private orderByPipe: OrderByPipe,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.topicService.getAllWithSubTopics(0)
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.topics = this.orderByPipe.transform(resp, ['orderIndex', 'name']);
        this.topics.forEach(item => item.subTopics = this.orderByPipe.transform(item.subTopics, ['orderIndex', 'name']));
      });
  }

  ngOnDestroy() {
  }

  create() {
    this.dialog.open(CreateTopicDialogComponent, {
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          this.topics.unshift(result);
        }
      });
  }

  createSub(topic: Topic) {
    this.dialog.open(CreateTopicDialogComponent, {
      data: topic,
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          topic.subTopics.unshift(result);
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

  editTopic(topic: Topic) {
    this.dialog.open(EditTopicDialogComponent, {
      data: topic,
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          topic = result;
        }
      });
  }

  moveTopic(topic: Topic) {
    this.dialog.open(MoveDialogComponent, {
      data: topic,
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result && result !== topic.parentId) {
          const oldParent = this.topics.find(item => item.id === topic.parentId);
          oldParent.subTopics.splice(oldParent.subTopics.indexOf(topic), 1);

          topic.parentId = result;
          const newParent = this.topics.find(item => item.id === topic.parentId);
          newParent.subTopics.push(topic);
        }
      });
  }

  onSave(topic: Topic) {
    this.loadingService.progressBarStart();
    let index = 0;
    topic.subTopics.forEach(item => item.orderIndex = index++);
    this.topicService.reOrder(topic)
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(() => {
        topic.checked = false;
        this.coreService.notifySuccess();
      });
  }

  onSaveParent() {
    this.loadingService.progressBarStart();
    let index = 0;
    this.topics.forEach(item => item.orderIndex = index++);
    const payload = new Topic();
    payload.subTopics = this.topics;
    this.topicService.reOrder(payload)
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(() => {
        this.reorder = false;
        this.coreService.notifySuccess();
      });
  }

  onCancel(topic: Topic) {
    topic.checked = false;
    topic.subTopics = this.orderByPipe.transform(topic.subTopics, ['orderIndex', 'name']);
  }

  onCancelParent() {
    this.reorder = false;
    this.topics = this.orderByPipe.transform(this.topics, ['orderIndex', 'name']);
  }
}
