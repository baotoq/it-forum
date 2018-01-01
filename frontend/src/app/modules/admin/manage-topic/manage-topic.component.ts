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

  trash = false;

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
        this.topics = this.orderByPipe.transform(resp, ['orderIndex', '-dateCreated']);
        this.topics.forEach(item => item.subTopics = this.orderByPipe.transform(item.subTopics, ['orderIndex', '-dateCreated']));
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
          result.subTopics = [];
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

  deleteTopic(topic: Topic, parent: Topic = null) {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.loadingService.progressBarStart();
          this.topicService.delete(topic.id)
            .finally(() => this.loadingService.progressBarStop())
            .subscribe(() => {
              if (parent === null) {
                const index = this.topics.indexOf(topic);
                this.topics.splice(index, 1);
              } else {
                const index = parent.subTopics.indexOf(topic);
                parent.subTopics.splice(index, 1);
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
    this.topicService.reorder(topic)
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(() => {
        topic.checked = false;
      });
  }

  onSaveParent() {
    this.loadingService.progressBarStart();
    let index = 0;
    this.topics.forEach(item => item.orderIndex = index++);
    const payload = new Topic();
    payload.subTopics = this.topics;
    this.topicService.reorder(payload)
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(() => {
        this.reorder = false;
      });
  }

  onCancel(topic: Topic) {
    topic.checked = false;
    topic.subTopics = this.orderByPipe.transform(topic.subTopics, ['orderIndex', '-dateCreated']);
  }

  onCancelParent() {
    this.reorder = false;
    this.topics = this.orderByPipe.transform(this.topics, ['orderIndex', '-dateCreated']);
  }

  getDeleted() {
    this.loadingService.spinnerStart();
    this.topicService.getAllDeletedWithSubTopics()
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.trash = true;
        this.topics = this.orderByPipe.transform(resp, ['-dateDeleted']);
        this.topics.forEach(item => item.subTopics = this.orderByPipe.transform(item.subTopics, ['dateDeleted']));
      });
  }

  restore(topic) {
    this.loadingService.progressBarStart();
    this.topicService.restore(topic.id)
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(() => {
        const index = this.topics.indexOf(topic);
        this.topics.splice(index, 1);
      });
  }

  permanentlyDelete(topic) {
    this.dialog.open(ConfirmDialogComponent).afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.loadingService.progressBarStart();
          this.topicService.permanentlyDelete(topic.id)
            .finally(() => this.loadingService.progressBarStop())
            .subscribe(() => {
              const index = this.topics.indexOf(topic);
              this.topics.splice(index, 1);
            });
        }
      });
  }
}
