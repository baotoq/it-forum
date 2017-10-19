import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, HttpModule, RequestOptions } from '@angular/http';

import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SnotifyModule, SnotifyService, SnotifyToastConfig, ToastDefaults } from 'ng-snotify';

import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';

import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    SnotifyModule.forRoot(),
    AppRoutingModule,
    AuthModule,
    CoreModule,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions],
    },
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    AuthGuard,
    AdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
