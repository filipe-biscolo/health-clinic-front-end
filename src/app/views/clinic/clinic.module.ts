import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicRoutingModule } from './clinic-routing.module';
import { ClinicComponent } from './clinic.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [ClinicComponent],
  imports: [
    CommonModule,
    ClinicRoutingModule,
    NgxMaskModule.forChild(),
    SharedModule
  ]
})
export class ClinicModule { }
