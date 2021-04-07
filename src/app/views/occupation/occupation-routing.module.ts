import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnectedGuard } from 'src/app/core/security/disconnected.guard';
import { OccupationComponent } from './occupation/occupation.component';
import { OccupationsComponent } from './occupations/occupations.component';

const routes: Routes = [{
  path: '',
  component: OccupationsComponent,
  canActivate: [DisconnectedGuard]
  },
  {
    path: 'new',
    component: OccupationComponent,
    canActivate: [DisconnectedGuard]
  },
  {
    path: 'edit/:id',
    component: OccupationComponent,
    canActivate: [DisconnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OccupationRoutingModule { }
