import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadComponent } from './thread/thread.component';
import { ThreadCreateComponent } from './thread-create/thread-create.component';
import { AuthGuard } from '../../guards/auth.guard';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'create',
    component: ThreadCreateComponent,
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
