import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MomentModule } from 'angular2-moment';
import { NgPipesModule } from 'ngx-pipes';
import { SharedModule } from '../shared/shared.module';

import { ThreadRoutingModule } from './thread-routing.module';
import { ThreadComponent } from './thread/thread.component';
import { ThreadService } from './thread.service';
import { ThreadCreateComponent } from './thread-create/thread-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule,
    FroalaViewModule,
    MomentModule,
    NgPipesModule,
    SharedModule,
    ThreadRoutingModule,
  ],
  declarations: [
    ThreadComponent,
    ThreadCreateComponent,
  ],
  providers: [
    ThreadService,
  ],
})
export class ThreadModule {
}
