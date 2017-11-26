import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './dashboard/widget/widget.component';
import { ApproveModule } from './approve/approve.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgPipesModule,
    MomentModule,
    SharedModule,
    AdminRoutingModule,
    ApproveModule,
  ],
  declarations: [
    DashboardComponent,
    WidgetComponent,
  ],
})
export class AdminModule {
}
