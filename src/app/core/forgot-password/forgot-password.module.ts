import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ForgotPasswordComponent, NewPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,

    SharedModule
  ]
})
export class ForgotPasswordModule { }
