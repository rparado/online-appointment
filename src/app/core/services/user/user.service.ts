import { inject, Injectable } from '@angular/core';
import { User } from '../../../models/User';
import { Observable, from, BehaviorSubject, throwError } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericApiResponse } from '../../../models/genericApiResponse';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_BASE = environment.apiUrl;

    readonly storageKey = 'activeUser';

    private reloadUserSubject = new BehaviorSubject<boolean>(true);
    reloadUser = this.reloadUserSubject.asObservable();

    private http = inject(HttpClient);
    private storage = inject(Storage);

    tempUser: User = <User>{};
    tempPassword: string = '';

    updateSupplySource: string = '';

    trainingToSettings: boolean = false;

    constructor() {}

    getUserFromStorage(): Observable<User> {
        return from(this.storage.get(this.storageKey));
    }

    triggerReloadUser() {
        this.reloadUserSubject.next(true);
    }

    async logout(): Promise<any> {
        const promise1 = this.storage.remove('token');

        return Promise.all([promise1]);
    }
    authenticate(email: string, password: string): Observable<User> {
        let email_encrypted = email;
        let password_encrypted = password;

        let data = {
            email: email_encrypted,
            password: password_encrypted,
        };

        return this.http.post<GenericApiResponse>(this.API_BASE + `/authenticate`, data).pipe(
            map((res) => {
                if (res.status == 'OK') {
                    let user_encrypted = res.data.user;

                    let user_decrypted_data = user_encrypted;

                    let updatedUser = user_decrypted_data;


                    this.storage.set('token', res.data.token);

                    return updatedUser;
                } else {
                    console.log('/authenticate resp error');
                    this.storage.remove('token');
                    throw new Error(res.status);
                }
            }),
            delay(250),
        );
    }
    registerUser(email: string, password: string): Observable<any> {
        let data = {
            email: email,
            password: password,
        };

        return this.http.post<GenericApiResponse>(this.API_BASE + `users/register`, data).pipe(
            tap((res) => {
              if (res.status === "success") {
                return res.data
              }
              return res;
            }),
            catchError((error) => {
              return throwError(() => new Error(error));
            }),
            delay(250)
          );
    }



}
