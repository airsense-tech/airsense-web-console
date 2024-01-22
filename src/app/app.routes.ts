import { Routes } from '@angular/router';
import { DataOverviewComponent } from './components/app-data-overview/data-overview.component';
import { DeviceManagementComponent } from './components/app-device-management/device-management.component';
import { LoginComponent } from './components/app-login/login.component';
import { RegisterComponent } from './components/app-register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    component: RegisterComponent,
  },
  {
    path: 'devices',
    canActivate: [AuthGuard],
    component: DeviceManagementComponent,
  },
  {
    path: 'overview',
    canActivate: [AuthGuard],
    component: DataOverviewComponent,
  },
];
