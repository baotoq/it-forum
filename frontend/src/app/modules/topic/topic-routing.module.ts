import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicListComponent } from './topic-list/topic-list.component';

const routes: Routes = [
  {
    path: '',
    component: TopicListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicRoutingModule {
}
