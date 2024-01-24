import { Routes } from '@angular/router';
import { DataOverviewComponent } from './components/app-data-overview/data-overview.component';
import { DeviceDetailsComponent } from './components/app-device-details/device-details.component';
import { DeviceManagementComponent } from './components/app-device-management/device-management.component';
import { LoginComponent } from './components/app-login/login.component';
import { NewDeviceComponent } from './components/app-new-device/new-device.component';
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
    data: { animation: 'login' },
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    component: RegisterComponent,
    data: { animation: 'register' },
  },
  {
    path: 'devices',
    canActivate: [AuthGuard],
    component: DeviceManagementComponent,
    data: { animation: 'devices' },
  },
  {
    path: 'devices/create',
    canActivate: [AuthGuard],
    component: NewDeviceComponent,
    data: { animation: 'devices/create' },
  },
  {
    path: 'devices/:id',
    canActivate: [AuthGuard],
    component: DeviceDetailsComponent,
    data: { animation: 'devices/:id' },
  },
  {
    path: 'overview',
    canActivate: [AuthGuard],
    component: DataOverviewComponent,
    data: { animation: 'register' },
  },
];
