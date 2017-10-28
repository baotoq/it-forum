import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThreadRoutingModule } from './thread-routing.module';
import { ThreadComponent } from './thread/thread.component';
import { ThreadService } from './thread.service';

@NgModule({
  imports: [
    CommonModule,
    ThreadRoutingModule,
  ],
  declarations: [
    ThreadComponent,
  ],
  providers: [
    ThreadService,
  ],
})
export class ThreadModule {
}
