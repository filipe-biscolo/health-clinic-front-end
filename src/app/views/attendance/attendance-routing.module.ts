import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  // {
  // path: '',
  // component: HealthInsurancesComponent,
  // canActivate: [DisconnectedGuard]
  // },
  {
    path: 'new/:idScheduling',
    component: AttendanceComponent,
    canActivate: [DisconnectedGuard]
  },
  {
    path: 'edit/:idAttendance',
    component: AttendanceComponent,
    canActivate: [DisconnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
