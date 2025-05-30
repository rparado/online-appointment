import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AppointmentService {
	private API_BASE = environment.apiUrl;
		
	private http = inject(HttpClient);

	public shouldRefresh = new BehaviorSubject<boolean>(false);
	
	constructor() { }

	bookAppointment(data: Appointment): Observable<any> {
		return this.http.post(`${this.API_BASE}appointments/book`, data);
	}

	getAllAppointments(): Observable<Appointment[]> {
		return this.http.get<Appointment[]>(`${this.API_BASE}appointments/patients`);
	}

	getDoctorAppointments(date: string): Observable<Appointment[]> {
		return this.http.get<Appointment[]>(`${this.API_BASE}appointments/doctor/${date}`);
	}

	getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
		return this.http.get<string[]>(`${this.API_BASE}appointments/slots/${doctorId}/${date}`);
	}

	cancelAppointment(appointmentId: number): Observable<any> {
		return this.http.put(`${this.API_BASE}appointments/cancel/${appointmentId}`, {});
	}

	updateAppointment(id: number, data: Partial<Appointment>): Observable<any> {
		return this.http.put(`${this.API_BASE}appointments/change/${id}`, data);
	}

	updateDoctorAppointment(id: number, data: Partial<Appointment>): Observable<any> {
		return this.http.put(`${this.API_BASE}appointments/doctor/change/${id}`, data);
	}
	// getDoctorsAppointment() {
	// 	return this.http.get<string[]>(`${this.API_BASE}appointments/slots/${doctorId}/${date}`);
	// }
}
