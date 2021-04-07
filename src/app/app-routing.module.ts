import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadingComponent } from './core/loading/loading.component';
import { LoginComponent } from './core/login/login.component';
import { DisconnectedGuard } from './core/security/disconnected.guard';
import { ConnectedGuard } from './core/security/connected.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'loading',
    component: LoadingComponent,
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ConnectedGuard],
  },
  {
    path: 'signup',
    loadChildren: () => import('./core/signup/signup.module').then((module) => module.SignupModule),
    canActivate: [ConnectedGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./core/forgot-password/forgot-password.module').then(
        (module) => module.ForgotPasswordModule
      ),
    canActivate: [ConnectedGuard],
  },
  {
    path: 'clinic',
    loadChildren: () =>
      import('./views/clinic/clinic.module').then(
        (module) => module.ClinicModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./views/patient/patient.module').then(
        (module) => module.PatientModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'professionals',
    loadChildren: () =>
      import('./views/professional/professional.module').then(
        (module) => module.ProfessionalModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'occupations',
    loadChildren: () =>
      import('./views/occupation/occupation.module').then(
        (module) => module.OccupationModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'health-insurances',
    loadChildren: () =>
      import('./views/health-insurance/health-insurance.module').then(
        (module) => module.HealthInsuranceModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'procedures',
    loadChildren: () =>
      import('./views/procedure/procedure.module').then(
        (module) => module.ProcedureModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'schedule',
    loadChildren: () =>
      import('./views/schedule/schedule.module').then(
        (module) => module.ScheduleModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'attendances',
    loadChildren: () =>
      import('./views/attendance/attendance.module').then(
        (module) => module.AttendanceModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./views/reports/reports.module').then(
        (module) => module.ReportsModule
      ),
    canActivate: [DisconnectedGuard],
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
