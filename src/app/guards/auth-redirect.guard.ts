import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { UserService } from '../core/services/user/user.service';
import { NavController } from '@ionic/angular';
import { PATH } from '@bauerfeind/config/path';

/**
 * Guard to prevent logged-in users from accessing onboarding screens
 */
@Injectable({
    providedIn: 'root',
})
export class AuthRedirectGuard implements CanActivate {
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

    /**
     * Checks if user is already authenticated
     * If yes, redirects to dashboard
     * If no, allows access to onboarding routes
     */
    private async checkAuth(): Promise<boolean> {
        const user = await firstValueFrom(this.userService.getUserFromStorage());

        if (user) {
            // Redirect logged-in users to the dashboard instead of allowing
            // them to access onboarding screens
            this.navCtrl.navigateRoot(PATH.APP_REDIRECTION);

            // Prevent navigation to the requested route
            return false;
        }

        // No user found in storage, allow access to onboarding routes
        return true;
    }
}
