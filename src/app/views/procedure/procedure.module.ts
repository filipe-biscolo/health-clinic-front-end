import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcedureRoutingModule } from './procedure-routing.module';
import { ProcedureComponent } from './procedure/procedure.component';
import { ProceduresComponent } from './procedures/procedures.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [ProcedureComponent, ProceduresComponent],
  imports: [
    CommonModule,
    ProcedureRoutingModule,
    NgxMaskModule.forChild(),

    SharedModule
  ]
})
export class ProcedureModule { }
