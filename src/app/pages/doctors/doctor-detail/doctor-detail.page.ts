import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonImg, IonRow, IonGrid, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButtons, IonModal, IonItem, IonLabel, IonText, IonInput, IonDatetime, IonSelectOption, IonSelect, NavController } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '@oda/core/services/doctors/doctor.service';
import { finalize } from 'rxjs';
import { Doctor } from 'src/app/models/Doctor';

import { OverlayEventDetail } from '@ionic/core/components';
import { AppointmentService } from '@oda/core/services/appointment/appointment.service';
import { ToastService } from '@oda/core/services/toast.service';

@Component({
	selector: 'app-doctor-detail',
	templateUrl: './doctor-detail.page.html',
	styleUrls: ['./doctor-detail.page.scss'],
	standalone: true,
	imports: [IonDatetime, IonInput, IonText, IonLabel, IonItem, IonModal, IonButtons, IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonRow, IonImg, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,PageStandardPage, IonGrid, IonCol, ReactiveFormsModule, IonSelectOption, IonSelect ]
})
export class DoctorDetailPage implements OnInit {

	navCtrl = inject(NavController);


	loading: boolean = false;

	fb = inject(FormBuilder);

	route = inject(ActivatedRoute);

	doctorService = inject(DoctorService);

	appointmentService = inject(AppointmentService);

	doctor?: Doctor;

	@ViewChild(IonModal) modal!: IonModal;

	today = new Date().toISOString().split('T')[0];

	availableSlots: string[] = [];

	selectedSlot: string = '';

	myForm!: FormGroup;

	showDatePicker = false;

	appointmentDateDisplay: string = '';


	toastService = inject(ToastService);
	
	appointmentDate = new Date().toISOString().split('T')[0];

	constructor() { }

	getAvailableSlots() {
		this.appointmentService.getAvailableSlots(<any>this.doctor?.id, this.appointmentDate)
		.subscribe((res: any) => {

			this.availableSlots = res;

			// Set default
			if (this.availableSlots.length > 0) {
			  this.selectedSlot = this.availableSlots[0];
			}

			this.myForm = this.fb.group({
				doctor_id: [''],
				patient_id: [''],
				appointment_date: ['', Validators.required],
				time_slot: [this.selectedSlot]
			});
		  });
	}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id')!;

		this.doctorService.getDoctor(id)
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 1000))
		)
		.subscribe({
			next: (doctor: Doctor) => {
				this.doctor = doctor;
			},
			error: (err) => {
				console.error('Failed to load doctors:', err.message);
			}
		});

		this.getAvailableSlots();
	}


	cancel() {
		this.modal.dismiss(null, 'cancel');
	}

	confirm() {
		let data:any = {
			patientId: this.doctor?.userId,
			doctorId: this.doctor?.id,
			appointmentDate: this.myForm.value.appointment_date,
			timeslot: this.myForm.value.time_slot,
			status: "pending"
		}

		this.appointmentService.bookAppointment(data)
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 1000))
		)
		 .subscribe({
				next: (data) => {
					console.log('data ', data)
					if (data.status === "success") {
						this.toastService.presentSuccessToast(data.message);
						this.loading = false;
						this.modal.dismiss();
		
					} else {
						console.log('else')
						this.toastService.presentErrorToast(data.message);
						this.loading = false;
						this.modal.dismiss();
					}
				},
				error: (err) => {
					this.toastService.presentErrorToast('Time slot already booked for this doctor on that date.');
				  }
			});
	}

	onDateChange(event: any) {
		const rawDate = event.detail.value;

		if (!rawDate) return;

		// Convert to local date object
		const date = new Date(rawDate);

		// Format as YYYY-MM-DD (local date only)
		const formattedDate = date.toISOString().split('T')[0];

		this.appointmentDateDisplay = formattedDate;
		this.myForm.get('appointment_date')?.setValue(formattedDate);

		this.showDatePicker = false;
	}

	onSlotChange(event: any) {
		this.selectedSlot = event.detail.value;
	}

}
