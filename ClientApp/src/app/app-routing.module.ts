import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuard } from './shared/guards/route.guard';
import { LoginGuard } from './shared/guards/login.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginModule',
    canLoad: [LoginGuard],
    canActivateChild: [LoginGuard]
  },
  {
    path: 'welcome',
    loadChildren: './pages/welcome/welcome.module#WelcomeModule',
    canActivateChild: [RouteGuard]
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
