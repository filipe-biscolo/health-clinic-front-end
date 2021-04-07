import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { ProcedureComponent } from './procedure/procedure.component';
import { ProceduresComponent } from './procedures/procedures.component';

const routes: Routes = [{
  path: '',
  component: ProceduresComponent,
  canActivate: [DisconnectedGuard]
  },
  {
    path: 'new',
    component: ProcedureComponent,
    canActivate: [DisconnectedGuard]
  },
  {
    path: 'edit/:id',
    component: ProcedureComponent,
    canActivate: [DisconnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcedureRoutingModule { }
