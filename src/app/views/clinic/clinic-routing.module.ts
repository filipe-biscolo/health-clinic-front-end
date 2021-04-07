import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { ClinicComponent } from './clinic.component';

const routes: Routes = [{
  path: ':id',
  component: ClinicComponent,
  canActivate: [DisconnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
