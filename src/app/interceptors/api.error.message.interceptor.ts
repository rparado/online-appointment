// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

// import { Observable } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';

// import { DialogService } from '../core/services/dialog/dialog.service';

// @Injectable()
// export class ApiErrorMessageInterceptor implements HttpInterceptor {
//     constructor(private dialogService: DialogService) {}

//     private API_BASE = environment.apiUrl;

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         return next.handle(request).pipe(
//             catchError((error: HttpErrorResponse) => {
//                 //show generic message modal
//                 this.dialogService
//                     .openMessageDialog({
//                         headingText: 'Error processing request. Please try again.',
//                     })
//                     .subscribe((confirm) => {});

//                 throw new Error(error.status + ': ' + request.url);
//             }),
//         );
//     }
// }
