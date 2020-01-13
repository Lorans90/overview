import { NgModule, ModuleWithProviders } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { GridsterModule } from 'angular-gridster2';

import { WelcomeComponent } from './welcome.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    SharedModule
  ],
  declarations: [WelcomeComponent, DashboardComponent, OverviewComponent, ChangePasswordComponent],
})
export class WelcomeModule { }
