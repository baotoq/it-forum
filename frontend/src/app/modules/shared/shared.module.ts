import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './modules/material/material.module';
import { FilterByPipe, NgPipesModule, OrderByPipe } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HasErrorPipe } from './pipes/has-error.pipe';
import { IsExistPipe } from './pipes/is-exist.pipe';
import { IsManagementPipe } from './pipes/is-management';

import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';
import { PreventDefaultDirective } from './directives/prevent-default/prevent-default.directive';
import { PreventScrollDirective } from './directives/prevent-scroll/prevent-scroll.directive';

import { FontAwesomeSpinnerComponent } from './components/font-awesome-spinner/font-awesome-spinner.component';
import { MaterialSpinnerComponent } from './components/material-spinner/material-spinner.component';
import { ColumnChartComponent } from './components/column-chart/column-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BadgeRoleComponent } from './components/badge-role/badge-role.component';
import { BadgeApprovalStatusComponent } from './components/badge-approval-status/badge-approval-status.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MarkdownEditorComponent } from './components/md-editor/md-editor.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';

const COMPONENTS = [
  FontAwesomeSpinnerComponent,
  MaterialSpinnerComponent,
  ColumnChartComponent,
  LineChartComponent,
  BadgeRoleComponent,
  BadgeApprovalStatusComponent,
  MarkdownEditorComponent,
  UserAvatarComponent,
];

const PIPES = [
  HasErrorPipe,
  IsExistPipe,
  IsManagementPipe,
];

const DIRECTIVES = [
  ClickStopPropagationDirective,
  PreventDefaultDirective,
  PreventScrollDirective,
];

const MODULES = [
  NgPipesModule,
  MomentModule,
  MaterialModule,
  NgbModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Ng2GoogleChartsModule,
    MODULES,
  ],
  declarations: [COMPONENTS, PIPES, DIRECTIVES, ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent],
  exports: [COMPONENTS, PIPES, DIRECTIVES, MODULES],
  providers: [
    PIPES,
    OrderByPipe,
    FilterByPipe,
  ],
})
export class SharedModule {
}
