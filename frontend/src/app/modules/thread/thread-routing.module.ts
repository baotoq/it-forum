import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadComponent } from './thread/thread.component';
import { ThreadCreateComponent } from './thread-create/thread-create.component';
import { ThreadEditComponent } from './thread-edit/thread-edit.component';
import { AuthGuard } from '../../guards/auth.guard';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'create',
    component: ThreadCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:threadId',
    component: ThreadEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
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
