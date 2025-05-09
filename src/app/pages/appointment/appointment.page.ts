import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonDatetime, IonModal, IonImg, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButtons } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { AppointmentService } from '@oda/core/services/appointment/appointment.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
  standalone: true,
  imports: [IonButtons, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonImg, IonModal, IonDatetime, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PageStandardPage]
})
export class AppointmentPage implements OnInit {
  loading: boolean = false;

  appointment = inject(AppointmentService);
  
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
		next: (data) => {
			console.log('data ', data)

		},
		error: (err) => {
			console.error('Failed to load appointments:', err.message);
		}
	});
  }

}
