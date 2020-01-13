import { Injectable } from '@angular/core';
import { Router, CanLoad, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate, CanLoad {

    constructor(
        private router: Router,
        private authService: AuthService,
    ) { }

    canLoad(): boolean {
        const routerState = this.router.getCurrentNavigation().extras.state;
        const systemAction = routerState && routerState.systemAction;
        if (
            this.authService.isLoggedIn() && !systemAction) {
            this.router.navigate(['welcome']);
            return false;
        }
        return true;
    }

    canActivate(): boolean {
        return this.canLoad();
    }

    canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canLoad();
    }
}
