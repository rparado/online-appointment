import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
    private API_BASE = environment.apiUrl;

    constructor(private storage: Storage) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // List of API calls we want to add the Bearer token
        // this will be updated once all api endpoints completed
        const apiEndpoints = [
            `${this.API_BASE}/update-email`,
            `${this.API_BASE}/update-password`,
            `${this.API_BASE}/export`,
            `${this.API_BASE}/delete-account`,
            `${this.API_BASE}/sync-account`,
            `${this.API_BASE}/get-user`,
            `${this.API_BASE}/version`,
        ];

        // Only intercept requests to the specified API endpoints
        if (apiEndpoints.includes(request.url)) {
            // Convert the Promise from storage.get to an Observable using 'from'
            return from(this.storage.get('token')).pipe(
                switchMap((token: string | null) => {
                    if (token) {
                        // Clone the request and add the Authorization header with the token
                        const clonedRequest = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        return next.handle(clonedRequest);
                    } else {
                        // If no token found, pass the original request without modifications
                        return next.handle(request);
                    }
                }),
            );
        } else {
            // Pass non-matching requests through without modification
            return next.handle(request);
        }
    }
}
