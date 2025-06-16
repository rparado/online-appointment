import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, } from 'rxjs';
import { map, switchMap, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { UserProfile } from 'src/app/models/User';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private API_BASE = environment.apiUrl;


	private http = inject(HttpClient);
	private storage = inject(Storage);
	private router = inject(Router);

	private currentUserSubject = new BehaviorSubject<any>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	constructor() {
		this.loadStoredUser();
	}

	private async loadStoredUser() {
		const { value } = await Preferences.get({ key: 'user' });
		if (value) {
		this.currentUserSubject.next(JSON.parse(value));
		}
	}
	async logout(): Promise<void> {
		await Preferences.remove({ key: 'token' });
		await Preferences.remove({ key: 'user' });
		this.currentUserSubject.next(null);
		this.router.navigate(['/login']);
	}
	login(email: string, password: string): Observable<any> {
		 const data = { email, password };
		return this.http.post<any>(this.API_BASE + 'users/login', data).pipe(
			tap(async (res) => {
			if (res.status === 'success') {
				await Preferences.set({ key: 'user', value: JSON.stringify(res.user) });
				await Preferences.set({ key: 'token', value: res.token });
				this.currentUserSubject.next(res.user);
			}
			})
		);
	}
	register(email: string, password: string, role: string = 'patient'): Observable<any> {
		 const data = { email, password, role };
		return this.http.post<any>(this.API_BASE + 'users/register', data).pipe(
		switchMap(async (res) => {
			if (res.status === 'success') {
			await Preferences.set({ key: 'user', value: JSON.stringify(res.user) });
			await Preferences.set({ key: 'token', value: res.token });
			this.currentUserSubject.next(res.user);
			return res;
			} else {
			throw new Error(res.message);
			}
		}),
		from
		);
	  }
	
	  ///user/profile
	updateProfile(userId: number, formData: FormData): Observable<any>{
		return this.http.put<any>(`${this.API_BASE}profile/${userId}/update`, formData).pipe(
			map((res) => {
			  if (res.status === 'success') {
				return res;
			  } else {
				throw new Error(res.message);
			  }
			})
		  );
	}

	getUserProfile(id: any) {
		return this.http.get<any>(`${this.API_BASE}users/${id}/profile`).pipe(
			map((res) => {
			  if (res.status === 'success') {
				return res;
			  } else {
				throw new Error(res.message);
			  }
			})
		  );
	}
}
