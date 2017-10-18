import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HasErrorPipe } from './pipes/has-error.pipe';
import { RequestService } from './services/request.service';

const COMPONENTS = [
  SpinnerComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS, MaterialModule],
  providers: [
    HasErrorPipe,
    RequestService,
  ],
})
export class SharedModule {
}
