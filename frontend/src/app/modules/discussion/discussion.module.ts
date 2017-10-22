import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { SharedModule } from '../shared/shared.module';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionComponent } from './discussion/discussion.component';
import { DiscussionService } from './discussion.service';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    MomentModule,
    SharedModule,
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
