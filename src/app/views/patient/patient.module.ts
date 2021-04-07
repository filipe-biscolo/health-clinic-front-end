import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientsComponent } from './patients/patients.component';
import { PatientComponent } from './patient/patient.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [PatientsComponent, PatientComponent],
  imports: [
    CommonModule,
    PatientRoutingModule,
    NgxMaskModule.forChild(),

    SharedModule
  ]
})
export class PatientModule { }
