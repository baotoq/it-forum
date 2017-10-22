import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HasErrorPipe } from './pipes/has-error.pipe';
import { OrderByPipe } from 'ngx-pipes/esm';
import { RequestService } from './services/request.service';

const COMPONENTS = [
  SpinnerComponent,
];

const PIPES = [
  HasErrorPipe,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [COMPONENTS, PIPES],
  exports: [COMPONENTS, PIPES, MaterialModule],
  providers: [
    PIPES,
    RequestService,
    OrderByPipe,
  ],
})
export class SharedModule {
}
