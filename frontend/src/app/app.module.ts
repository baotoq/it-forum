import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgbModule, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { DndModule } from 'ng2-dnd';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SpinnerComponent } from './components/loading/spinner/spinner.component';
import { ProgressBarComponent } from './components/loading/progress-bar/progress-bar.component';

import { LoadingService } from './components/loading/loading.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { CoreModule } from './modules/core/core.module';
import { ThreadModule } from './modules/thread/thread.module';
import { TopicModule } from './modules/topic/topic.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './modules/shared/shared.module';

import { Storage } from './modules/shared/common/constant';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/combineLatest';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    ProgressBarComponent,
    ClientLayoutComponent,
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem(Storage.AUTH);
        },
        whitelistedDomains: ['localhost:5000', 'tdtgame.azurewebsites.net'],
        skipWhenExpired: true,
      },
    }),
    SnotifyModule.forRoot(),
    NgbModule.forRoot(),
    DndModule.forRoot(),
    AppRoutingModule,
    AuthModule,
    AdminModule,
    ThreadModule,
    TopicModule,
    TagModule,
    CoreModule,
    UserModule,
    SharedModule,
  ],
  providers: [
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    NgbPaginationConfig,
    SnotifyService,
    LoadingService,
    AuthGuard,
    AdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(config: NgbPaginationConfig) {
    config.rotate = true;
    config.maxSize = 6;
  }
}
