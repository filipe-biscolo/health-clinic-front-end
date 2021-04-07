import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectedGuard } from '../security/connected.guard';
import { FormComponent } from './form/form.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [{
  path: '',
  component: SignupComponent,
  canActivate: [ConnectedGuard]
  },
  {
    path: 'form',
    component: FormComponent,
    canActivate: [ConnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
