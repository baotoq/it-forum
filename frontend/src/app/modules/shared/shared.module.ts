import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HasErrorPipe } from './pipes/has-error.pipe';
import { FilterByPipe, OrderByPipe } from 'ngx-pipes/esm';
import { RequestService } from './services/request.service';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';

const COMPONENTS = [
  SpinnerComponent,
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
