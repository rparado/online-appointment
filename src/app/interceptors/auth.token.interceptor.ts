import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
     providedIn: 'root'
})
export class AuthTokenInterceptor implements HttpInterceptor {
    private API_BASE = environment.apiUrl;

    private interceptUrls = [
        'profile',
        'appointment',
        'doctors',
        'payment'
    ];

    constructor() {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const shouldIntercept = this.interceptUrls.some(path =>
            request.url.startsWith(`${this.API_BASE}${path}/`) || request.url === `${this.API_BASE}${path}`
          );
        const token = localStorage.getItem('token');

        if (!shouldIntercept) {
            return next.handle(request);
        }
     
        // Only intercept requests to the specified API endpoints
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
        
    }
}
