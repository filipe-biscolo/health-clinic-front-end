import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AttendanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,

    SharedModule
  ]
})
export class AttendanceModule { }
