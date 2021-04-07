import { ProfessionalsComponent } from './professionals/professionals.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { ProfessionalComponent } from './professional/professional.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessionalsComponent,
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'new',
    component: ProfessionalComponent,
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'edit/:id',
    component: ProfessionalComponent,
    canActivate: [DisconnectedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessionalRoutingModule {}
