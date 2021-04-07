import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { ScheduleComponent } from './schedule/schedule.component';


@NgModule({
  declarations: [ScheduleComponent, SchedulingComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    NgxMaskModule.forChild(),

    SharedModule
  ]
})
export class ScheduleModule { }
