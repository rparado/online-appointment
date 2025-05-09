import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonDatetime, IonModal, IonImg, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButtons, IonCardTitle, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { AppointmentService } from '@oda/core/services/appointment/appointment.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonItem, IonCardTitle, IonButtons, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonImg, IonModal, IonDatetime, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PageStandardPage, IonCardSubtitle]
})
export class AppointmentPage implements OnInit {
  loading: boolean = false;

  appointment = inject(AppointmentService);

  appointments: any[] = [];
  
  constructor() { }

  ngOnInit() {
	this.getAppointments();
  }
  getAppointments() {
	const userStr:any  = localStorage.getItem('user');
	const user = JSON.parse(userStr);
	this.appointment.getAllAppointments()
	.pipe(
		finalize(() => setTimeout(() => this.loading = false, 1000))
	)
	.subscribe({
		next: (response: any) => {
			this.appointments = this.groupAppointmentsByDoctor(response.data);

			console.log('this.appointments ', this.appointments)
		},
		error: (err) => {
			console.error('Failed to load appointments:', err.message);
		}
	});
  }
  groupAppointmentsByDoctor(appointments: any[]): any[] {
	const grouped = new Map();
  
	for (const appt of appointments) {
	  const key = appt.doctorId;
	  if (!grouped.has(key)) {
		grouped.set(key, {
		  doctor: appt.doctor,
		  appointments: []
		});
	  }
	  grouped.get(key).appointments.push(appt);
	}
  
	return Array.from(grouped.values());
  }
  cancelAppointment(appointmentId: number) {
    console.log('Cancel appointment with ID:', appointmentId);
    // Perform the cancellation logic here (e.g., calling the API to cancel)
  }

  // Call this when the Change button is clicked
  changeAppointment(appointmentId: number) {
    console.log('Change appointment with ID:', appointmentId);
    // Perform the change logic here (e.g., navigating to a change form)
  }
}
