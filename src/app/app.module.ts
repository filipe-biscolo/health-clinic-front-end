import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localePtBR from '@angular/common/locales/pt';
import { CoreModule } from './core/core.module';
import { NgxMaskModule } from 'ngx-mask';
import { SocialAuthServiceConfig, SocialLoginModule, GoogleLoginProvider } from 'angularx-social-login';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SignupModule } from './core/signup/signup.module';
import { ForgotPasswordModule } from './core/forgot-password/forgot-password.module';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RequestInterceptor } from './core/security/request.interceptor';
import { AttendanceModule } from './views/attendance/attendance.module';
import { ReportsModule } from './views/reports/reports.module';

registerLocaleData(localePtBR);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxMaskModule.forRoot(),

    CoreModule,
    SocialLoginModule,
    SignupModule,
    ForgotPasswordModule,
    ToastModule,
    AttendanceModule,
    ReportsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-br' },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.g_client_id)
          }
        ]
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {provide: MessageService},
    {provide: ConfirmationService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
