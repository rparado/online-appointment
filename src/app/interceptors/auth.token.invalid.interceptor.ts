import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { UserService } from '../core/services/user/user.service';

@Injectable()
export class AuthTokenInvalidInterceptor implements HttpInterceptor {
    private API_BASE = environment.apiUrl;
    user = inject(UserService);
    navCtrl = inject(NavController);

    constructor(
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let message = 'Error';

                if (request.url.includes(this.API_BASE)) {
                    if (error.status == 401) {
                        this.user.logout();
                        this.navCtrl.navigateRoot('/intro');
                        message = 'Unauthorized';
                    }
                }

                return throwError(message);
            }),
        );
    }
}
