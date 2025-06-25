import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MedicalRecord } from 'src/app/models/medicalRecord';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MedicalRecordService {
	private API_BASE = environment.apiUrl;
		
	private http = inject(HttpClient);

	constructor() { }

	createMedicalRecord(data: MedicalRecord): Observable<any> {
		return this.http.post(`${this.API_BASE}medical-records/create`, data);
	}
	getMedicalRecords(): Observable<any> {
		return this.http.get(`${this.API_BASE}medical-records/get-record`);
	}
}
