import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionComponent } from './discussion/discussion.component';
import { DiscussionService } from './discussion.service';

@NgModule({
  imports: [
    CommonModule,
    DiscussionRoutingModule,
  ],
  declarations: [
    DiscussionComponent,
  ],
  providers: [
    DiscussionService,
  ],
})
export class DiscussionModule {
}
