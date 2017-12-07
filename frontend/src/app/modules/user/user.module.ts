import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './user/profile/profile.component';
import { AccountComponent } from './user/account/account.component';
import { UserComponent } from './user/user.component';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UserRoutingModule,
  ],
  declarations: [ProfileComponent, AccountComponent, UserComponent],
  providers: [UserService],
})
export class UserModule {
}
