import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionComponent } from './discussion/discussion.component';

@NgModule({
  imports: [
    CommonModule,
    DiscussionRoutingModule,
  ],
  declarations: [
    DiscussionComponent,
  ],
})
export class DiscussionModule {
}
