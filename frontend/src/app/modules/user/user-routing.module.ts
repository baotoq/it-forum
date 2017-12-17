import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './settings/profile/profile.component';
import { AccountComponent } from './settings/account/account.component';

import { AuthGuard } from '../../guards/auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
      {path: 'profile', component: ProfileComponent},
      {path: 'account', component: AccountComponent},
    ],
  },
  {
    path: ':userId',
    component: UserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}
