import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, HttpModule, RequestOptions } from '@angular/http';

import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SnotifyModule, SnotifyService, SnotifyToastConfig, ToastDefaults } from 'ng-snotify';

import { AngularFireModule } from 'angularfire2';

import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';

import { AppComponent } from './app.component';
import { LoadingComponent } from './shared/loading/loading.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { LoadingService } from './shared/loading/loading.service';

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
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    SnotifyModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AppRoutingModule,
    AuthModule,
    CoreModule,
    SharedModule,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions],
    },
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    LoadingService,
    AuthGuard,
    AdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
