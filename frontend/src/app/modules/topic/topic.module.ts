import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { SharedModule } from '../shared/shared.module';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicService } from './topic.service';
import { TopicComponent } from './topic/topic.component';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    MomentModule,
    SharedModule,
    TopicRoutingModule,
  ],
  declarations: [TopicListComponent, TopicComponent],
  providers: [TopicService],
})
export class TopicModule {
}
