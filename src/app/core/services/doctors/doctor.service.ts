import { inject, Injectable } from '@angular/core';
import  { Doctor } from '../../../models/Doctor';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericApiResponse } from 'src/app/models/genericApiResponse';
@Injectable({
	providedIn: 'root'
})
export class DoctorService {
	private API_BASE = environment.apiUrl;
	
	private http = inject(HttpClient);

	
	constructor() { }

	getDoctors(): Observable<Doctor[]> {
		return this.http.get<GenericApiResponse>(`${this.API_BASE}doctors`).pipe(
			map((res) => {
				if (res.status === 'success') {
				return res.data as Doctor[];
				} else {
				throw new Error(res.message);
				}
			})
		);
	}
	getDoctor(id:string) {
		return this.http.get<GenericApiResponse>(`${this.API_BASE}doctors/${id}`).pipe(
			map((res) => {
				if (res.status === 'success') {
				return res.data as Doctor;
				} else {
				throw new Error(res.message);
				}
			})
		);
	}
}
