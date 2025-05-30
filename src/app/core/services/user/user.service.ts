import { inject, Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private API_BASE = environment.apiUrl;


	private http = inject(HttpClient);
	private storage = inject(StorageService);

	constructor() {}


	async logout(): Promise<any> {
		const promise1 = this.storage.delete('token');
		const promise2 = this.storage.delete('user');
		return Promise.all([promise1, promise2]);
	}
	login(email: string, password: string): Observable<any> {
		const data = { email, password };
		return this.http.post<any>(this.API_BASE + 'users/login', data).pipe(
		  map((res) => {
			if (res.status === 'success') {
				//localStorage.setItem('user', JSON.stringify(res.user));
			  //localStorage.setItem('token', res.token);
				this.storage.set('user', JSON.stringify(res.user));
				this.storage.set('token', res.token);
				this.storage.setOnboarded();
			  return res;
			} else {
			  throw new Error(res.message);
			}
		  })
		);
	  }
	register(email: string, password: string, role: string = 'patient'): Observable<any> {
		const data = { email, password, role };
		return this.http.post<any>(this.API_BASE + 'users/register', data).pipe(
		  map((res) => {
			if (res.status === 'success') {
				localStorage.setItem('user', JSON.stringify(res.user));
				localStorage.setItem('token', res.token);
			  return res;
			} else {
			  throw new Error(res.message);
			}
		  })
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
