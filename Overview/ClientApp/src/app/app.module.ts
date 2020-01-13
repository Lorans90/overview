import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData, CommonModule } from '@angular/common';
import localeUS from '@angular/common/locales/en';
import localeDE from '@angular/common/locales/de';
import localeUK from '@angular/common/locales/en-GB';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandler } from './core/handlers/error.handler';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(localeDE);
registerLocaleData(localeUK);
registerLocaleData(localeUS);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorInterceptor, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
