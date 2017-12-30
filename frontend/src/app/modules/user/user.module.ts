import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from '../shared/shared.module';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './settings/profile/profile.component';
import { AccountComponent } from './settings/account/account.component';
import { UserComponent } from './user/user.component';
import { UserService } from './user.service';
import { SettingsComponent } from './settings/settings.component';
import { UserPostsComponent } from './user/user-posts/user-posts.component';
import { UserThreadsComponent } from './user/user-threads/user-threads.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FileUploadModule,
    UserRoutingModule,
  ],
  declarations: [
    ProfileComponent,
    AccountComponent,
    UserComponent,
    SettingsComponent,
    UserPostsComponent,
    UserThreadsComponent,
  ],
  providers: [UserService],
})
export class UserModule {
}
