import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [{
  path: '',
  component: ReportsComponent,
  canActivate: [DisconnectedGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
