import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UnsavedChangesGuard } from 'src/app/shared/guards/unsaved-changes.guard';
import { DevicesComponent } from './devices/devices.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'devices',
        component: DevicesComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canDeactivate: [UnsavedChangesGuard]
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
