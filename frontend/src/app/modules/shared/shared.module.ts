import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { FontAwesomeSpinnerComponent } from './components/font-awesome-spinner/font-awesome-spinner.component';
import { HasErrorPipe } from './pipes/has-error.pipe';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes';
import { RequestService } from './services/request.service';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';
import { MaterialSpinnerComponent } from './components/material-spinner/material-spinner.component';
import { ColumnChartComponent } from './components/column-chart/column-chart.component';

const COMPONENTS = [
  FontAwesomeSpinnerComponent,
  MaterialSpinnerComponent,
  ColumnChartComponent,
];

const PIPES = [
  HasErrorPipe,
];

const DIRECTIVES = [
  ClickStopPropagationDirective,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    Ng2GoogleChartsModule,
  ],
  declarations: [COMPONENTS, PIPES, DIRECTIVES],
  exports: [COMPONENTS, PIPES, DIRECTIVES, MaterialModule],
  providers: [
    PIPES,
    RequestService,
    OrderByPipe,
    FilterByPipe,
  ],
})
export class SharedModule {
}
