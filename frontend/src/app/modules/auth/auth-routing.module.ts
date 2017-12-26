import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent,
    resolve: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    resolve: [AuthGuard],
  },
  {
    path: 'forgot',
    component: ForgotComponent,
  },
  {
    path: 'reset/:token',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
