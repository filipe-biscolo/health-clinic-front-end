import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [SignupComponent, FormComponent],
  imports: [
    CommonModule,
    SignupRoutingModule,
    NgxMaskModule.forChild(),
    SharedModule
  ]
})
export class SignupModule { }
