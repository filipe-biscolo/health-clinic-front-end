import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { HealthInsuranceComponent } from './health-insurance/health-insurance.component';
import { HealthInsurancesComponent } from './health-insurances/health-insurances.component';

const routes: Routes = [{
  path: '',
  component: HealthInsurancesComponent,
  canActivate: [DisconnectedGuard]
  },
  {
    path: 'new',
    component: HealthInsuranceComponent,
    canActivate: [DisconnectedGuard]
  },
  {
    path: 'edit/:id',
    component: HealthInsuranceComponent,
    canActivate: [DisconnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthInsuranceRoutingModule { }
