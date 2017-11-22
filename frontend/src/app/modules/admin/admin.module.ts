import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './dashboard/widget/widget.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { UserConfirmComponent } from './confirm/user-confirm/user-confirm.component';
import { ThreadConfirmComponent } from './confirm/thread-confirm/thread-confirm.component';
import { PostConfirmComponent } from './confirm/post-confirm/post-confirm.component';
import { UserConfirmSearchInputComponent } from './confirm/user-confirm/user-confirm-search-input/user-confirm-search-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgPipesModule,
    MomentModule,
    Ng2GoogleChartsModule,
    SharedModule,
    AdminRoutingModule,
  ],
  declarations: [
    DashboardComponent,
    WidgetComponent,
    ConfirmComponent,
    UserConfirmComponent,
    ThreadConfirmComponent,
    PostConfirmComponent,
    UserConfirmSearchInputComponent,
  ],
})
export class AdminModule {
}
