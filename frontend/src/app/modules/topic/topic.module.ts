import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';

@NgModule({
  imports: [
    CommonModule,
    TopicRoutingModule,
  ],
  declarations: [TopicListComponent],
})
export class TopicModule {
}
