import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { ApproveModule } from './approve/approve.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    ApproveModule,
    DashboardModule,
  ],
})
export class AdminModule {
}
