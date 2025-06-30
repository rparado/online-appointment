import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonButton, IonImg, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonModal,IonLabel, IonText, IonInput, IonDatetime, IonSelectOption, IonSelect, NavController, IonTitle, IonToolbar, IonButtons, IonHeader, IonIcon } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '@oda/core/services/doctors/doctor.service';
import { finalize } from 'rxjs';
import { Doctor } from 'src/app/models/Doctor';
import { closeOutline } from 'ionicons/icons';

import { AppointmentService } from '@oda/core/services/appointment/appointment.service';
import { ToastService } from '@oda/core/services/toast.service';
import { Preferences } from '@capacitor/preferences';

@Component({
	selector: 'app-doctor-detail',
	templateUrl: './doctor-detail.page.html',
	styleUrls: ['./doctor-detail.page.scss'],
	standalone: true,
	imports: [IonIcon, IonHeader, IonButtons, IonToolbar, IonTitle, IonDatetime, IonInput, IonText, IonLabel, IonModal, IonCardSubtitle,  IonCardContent, IonCardHeader, IonCard, IonImg, IonButton, IonContent, CommonModule, FormsModule,PageStandardPage, ReactiveFormsModule, IonSelectOption, IonSelect ]
})
export class DoctorDetailPage implements OnInit {

	navCtrl = inject(NavController);


	loading: boolean = false;

	fb = inject(FormBuilder);

	route = inject(ActivatedRoute);

	router = inject(Router);

	doctorService = inject(DoctorService);

	appointmentService = inject(AppointmentService);

	doctor?: Doctor;

	@ViewChild(IonModal) modal!: IonModal;

	today = new Date().toISOString().split('T')[0];

	availableSlots: { time: string; disabled: boolean }[] = [];

	selectedSlot: string = '';

	myForm!: FormGroup;

	showDatePicker = false;

	appointmentDateDisplay: string = '';

	toastService = inject(ToastService);
	
	appointmentDate = new Date().toISOString().split('T')[0];

	@ViewChild('validateAppointment', { static: true }) validateAppointment!: IonModal;

	close = closeOutline;

	constructor() { }

	

	getAvailableSlots() {
		 this.appointmentService.getAvailableSlots(<any>this.doctor?.id, this.appointmentDate)
			.subscribe((res: string[]) => {
				const now = new Date();
				const appointmentDate = new Date(this.appointmentDate);
				const isToday = now.toDateString() === appointmentDate.toDateString();

				this.availableSlots = res.map((slot) => {
					const [time, meridian] = slot.split(' ');
					let [hours, minutes] = time.split(':').map(Number);

					if (meridian === 'PM' && hours < 12) hours += 12;
					if (meridian === 'AM' && hours === 12) hours = 0;

					const slotTime = new Date(appointmentDate);
					slotTime.setHours(hours, minutes, 0, 0);

				const isDisabled = isToday && slotTime <= now;

					return {
						time: slot,
						disabled: isDisabled
					};
				});

				// Set first valid slot as default
				const firstAvailable = this.availableSlots.find(s => !s.disabled);
				this.selectedSlot = firstAvailable?.time ?? '';

				this.myForm = this.fb.group({
					doctor_id: [''],
					patient_id: [''],
					appointment_date: [this.appointmentDate],
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
				console.log('doctor ', doctor)
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

	async confirm() {

		const { value } = await Preferences.get({ key: 'user' });
  		const user = value ? JSON.parse(value) : null;


		let data:any = {
			patientId: user?.id,
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
					if (data.status === "success") {
						this.toastService.presentSuccessToast(data.message);
						this.loading = false;
						this.modal.dismiss();
						this.validateAppointment.dismiss();
						this.appointmentService.shouldRefresh.next(true);
						this.router.navigateByUrl('/apps/appointments');
		
					} else {
						this.toastService.presentErrorToast(data.message);
						this.loading = false;
						this.modal.dismiss();
						this.validateAppointment.dismiss();
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


		// Format as YYYY-MM-DD (local date only)
		const formattedDate = rawDate.split('T')[0];

		this.appointmentDateDisplay = formattedDate;
		this.myForm.get('appointment_date')?.setValue(formattedDate);

		this.showDatePicker = false;
	}

	onSlotChange(event: any) {
		this.selectedSlot = event.detail.value;
	}
	closeModal() {
		this.validateAppointment.dismiss();
	}
	showValidateModal() {
		this.validateAppointment.present();
	}
}
