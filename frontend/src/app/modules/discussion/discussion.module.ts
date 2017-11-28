import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionService } from './discussion.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DiscussionRoutingModule,
  ],
  declarations: [],
  providers: [
    DiscussionService,
  ],
})
export class DiscussionModule {
}
