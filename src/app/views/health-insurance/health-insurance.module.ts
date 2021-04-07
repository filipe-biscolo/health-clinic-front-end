import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthInsuranceRoutingModule } from './health-insurance-routing.module';
import { HealthInsuranceComponent } from './health-insurance/health-insurance.component';
import { HealthInsurancesComponent } from './health-insurances/health-insurances.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [HealthInsuranceComponent, HealthInsurancesComponent],
  imports: [
    CommonModule,
    HealthInsuranceRoutingModule,

    SharedModule
  ]
})
export class HealthInsuranceModule { }
