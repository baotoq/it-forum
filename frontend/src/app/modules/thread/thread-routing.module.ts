import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadComponent } from './thread/thread.component';
import { ThreadCreateComponent } from './thread-create/thread-create.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: 'create',
    component: ThreadCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':threadId',
    component: ThreadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThreadRoutingModule {
}
