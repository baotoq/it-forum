import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const CLIENT_ROUTES: Routes = [
  {path: '', redirectTo: 'topic', pathMatch: 'full'},
  {
    path: 'topic',
    loadChildren: 'app/modules/topic/topic.module#TopicModule',
  },
  {
    path: 'thread',
    loadChildren: 'app/modules/thread/thread.module#ThreadModule',
  },
  {
    path: 'auth',
    loadChildren: 'app/modules/auth/auth.module#AuthModule',
  },
  {
    path: 'user',
    loadChildren: 'app/modules/user/user.module#UserModule',
  },
];

const ADMIN_ROUTES: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '',
    loadChildren: 'app/modules/admin/admin.module#AdminModule',
  },
];

const routes: Routes = [
  {path: 'admin', component: AdminLayoutComponent, children: ADMIN_ROUTES, canActivate: [AuthGuard, AdminGuard]},
  {path: '', component: ClientLayoutComponent, children: CLIENT_ROUTES},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
