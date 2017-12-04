import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { FilterByPipe, NgPipesModule, OrderByPipe } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { HasErrorPipe } from './pipes/has-error.pipe';

import { RequestService } from './services/request.service';

import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';

import { FontAwesomeSpinnerComponent } from './components/font-awesome-spinner/font-awesome-spinner.component';
import { MaterialSpinnerComponent } from './components/material-spinner/material-spinner.component';
import { ColumnChartComponent } from './components/column-chart/column-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';

const COMPONENTS = [
  FontAwesomeSpinnerComponent,
  MaterialSpinnerComponent,
  ColumnChartComponent,
  LineChartComponent,
];

const PIPES = [
  HasErrorPipe,
];

const DIRECTIVES = [
  ClickStopPropagationDirective,
];

const MODULES = [
  NgPipesModule,
  MomentModule,
  MaterialModule,
];

@NgModule({
  imports: [
    CommonModule,
    Ng2GoogleChartsModule,
    MODULES,
  ],
  declarations: [COMPONENTS, PIPES, DIRECTIVES],
  exports: [COMPONENTS, PIPES, DIRECTIVES, MODULES],
  providers: [
    PIPES,
    RequestService,
    OrderByPipe,
    FilterByPipe,
  ],
})
export class SharedModule {
}
