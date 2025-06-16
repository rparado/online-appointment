import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { from, Observable, switchMap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
     providedIn: 'root'
})
export class AuthTokenInterceptor implements HttpInterceptor {
    private API_BASE = environment.apiUrl;

    private interceptUrls = [
        'profile',
        'appointments',
        'doctors',
        'payment'
    ];

    constructor() {

    }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldIntercept = this.interceptUrls.some(path =>
      request.url.startsWith(`${this.API_BASE}${path}/`) || request.url === `${this.API_BASE}${path}`
    );

    if (!shouldIntercept) {
      return next.handle(request);
    }

    // Read token from Capacitor Preferences
    return from(Preferences.get({ key: 'token' })).pipe(
      switchMap(({ value: token }) => {
        if (token) {
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(clonedRequest);
        } else {
          return next.handle(request);
        }
      })
    );
  }
}
