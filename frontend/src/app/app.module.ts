import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, HttpModule, RequestOptions } from '@angular/http';

import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SnotifyModule, SnotifyService, SnotifyToastConfig, ToastDefaults } from 'ng-snotify';
import { NgbModule, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { TopicModule } from './modules/topic/topic.module';
import { ThreadModule } from './modules/thread/thread.module';
import { TagModule } from './modules/tag/tag.module';
import { AdminModule } from './modules/admin/admin.module';
import { SharedModule } from './modules/shared/shared.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { SpinnerComponent } from './components/loading/spinner/spinner.component';
import { ProgressBarComponent } from './components/loading/progress-bar/progress-bar.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { LoadingService } from './components/loading/loading.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

export const firebaseConfig = {
  apiKey: 'AIzaSyD98ML_lIiA54eZ7ix5Xn0ON4N9zQAxm7E',
  authDomain: 'tdt-game.firebaseapp.com',
  databaseURL: 'https://tdt-game.firebaseio.com',
  projectId: 'tdt-game',
  storageBucket: 'tdt-game.appspot.com',
  messagingSenderId: '670949218812',
};

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ClientLayoutComponent,
    SpinnerComponent,
    ProgressBarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    SnotifyModule.forRoot(),
    NgbModule.forRoot(),
    AppRoutingModule,
    AuthModule,
    CoreModule,
    TopicModule,
    ThreadModule,
    TagModule,
    AdminModule,
    SharedModule,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions],
    },
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
