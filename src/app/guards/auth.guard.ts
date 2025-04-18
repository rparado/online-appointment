import { Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    Route,
    UrlSegment,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    CanMatch,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { UserService } from '../core/services/user/user.service';
import { NavController } from '@ionic/angular';
import { PATH } from '@bauerfeind/config/path';

/**
 * Guard to prevent logged-out users from accessing main app screens
 */
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanMatch {
    constructor(
        private userService: UserService,
        private navCtrl: NavController,
    ) {}

    canActivate(
        _next: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkAuth();
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(next, state);
    }

    canMatch(_route: Route, _segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkAuth();
    }

    private async checkAuth(): Promise<boolean> {
        const user = await firstValueFrom(this.userService.getUserFromStorage());

        if (!user) {
            this.navCtrl.navigateRoot(PATH.INTRO);
            return false;
        }

        return true;
    }
}
