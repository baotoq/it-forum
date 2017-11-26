import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { SharedModule } from '../../shared/shared.module';

import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './dashboard/widget/widget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgPipesModule,
    MomentModule,
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
    WidgetComponent,
  ],
  providers: [DashboardService],
})
export class DashboardModule {
}
