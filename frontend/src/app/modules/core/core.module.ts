import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { CoreService } from './core.service';

@NgModule({
  imports: [
    CommonModule,
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
