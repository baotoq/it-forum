import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { CoreService } from './core.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    NavbarComponent,
  ],
  exports: [
    NavbarComponent,
  ],
  providers: [
    CoreService,
  ],
})
export class CoreModule {
}
