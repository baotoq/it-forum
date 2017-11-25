import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'register', redirectTo: 'auth/register', pathMatch: 'full'},
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
