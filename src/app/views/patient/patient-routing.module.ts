import { PatientsComponent } from './patients/patients.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { PatientComponent } from './patient/patient.component';

const routes: Routes = [{
  path: '',
  component: PatientsComponent,
  canActivate: [DisconnectedGuard]
  },
  {
    path: 'new',
    component: PatientComponent,
    canActivate: [DisconnectedGuard]
  },
  {
    path: 'edit/:id',
    component: PatientComponent,
    canActivate: [DisconnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
