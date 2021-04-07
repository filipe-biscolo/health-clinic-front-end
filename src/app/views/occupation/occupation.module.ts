import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OccupationRoutingModule } from './occupation-routing.module';
import { OccupationComponent } from './occupation/occupation.component';
import { OccupationsComponent } from './occupations/occupations.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OccupationComponent, OccupationsComponent],
  imports: [
    CommonModule,
    OccupationRoutingModule,

    SharedModule
  ]
})
export class OccupationModule { }
