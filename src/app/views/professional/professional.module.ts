import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalRoutingModule } from './professional-routing.module';
import { ProfessionalsComponent } from './professionals/professionals.component';
import { ProfessionalComponent } from './professional/professional.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [ProfessionalsComponent, ProfessionalComponent],
  imports: [
    CommonModule,
    ProfessionalRoutingModule,
    NgxMaskModule.forChild(),

    SharedModule
  ]
})
export class ProfessionalModule { }
