import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, RequestOptions } from '@angular/http';

import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SnotifyModule, SnotifyService, SnotifyToastConfig, ToastDefaults } from 'ng-snotify';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './modules/core/core.module';

import { AppComponent } from './app.component';

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
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    SnotifyModule.forRoot(),
    AppRoutingModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
