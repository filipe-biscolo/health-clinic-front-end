import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectedGuard } from '../security/connected.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';

const routes: Routes = [{
  path: '',
  component: ForgotPasswordComponent,
  canActivate: [ConnectedGuard]
  },
  {
    path: 'new',
    component: NewPasswordComponent,
    canActivate: [ConnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
