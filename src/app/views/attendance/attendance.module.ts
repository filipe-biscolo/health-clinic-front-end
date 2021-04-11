import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttendancesComponent } from './attendances/attendances.component';


@NgModule({
  declarations: [AttendanceComponent, AttendancesComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,

    SharedModule
  ]
})
export class AttendanceModule { }
