import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicComponent } from './topic/topic.component';
import { DiscussionComponent } from './topic/discussion/discussion.component';

const routes: Routes = [
  {
    path: '',
    component: TopicListComponent,
  },
  {
    path: 'discussion',
    component: TopicComponent,
    children: [
      {
        path: ':discussionId',
        component: DiscussionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicRoutingModule {
}
