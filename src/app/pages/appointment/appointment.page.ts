import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonDatetime, IonModal, IonImg, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButtons, IonSelectOption, IonCardTitle, IonItem, IonLabel, IonList, IonText, IonIcon, ActionSheetController, IonSelect, IonInput, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { AppointmentService } from '@oda/core/services/appointment/appointment.service';
import { finalize, Subject,} from 'rxjs';

import { ellipsisVerticalOutline } from 'ionicons/icons';
import { ToastService } from '@oda/core/services/toast.service';
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonIcon, IonText, IonList, IonLabel, IonItem, IonCardTitle, IonButtons, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonImg, IonModal, IonDatetime, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PageStandardPage, IonCardSubtitle, ReactiveFormsModule, IonSelectOption, IonSelect, IonInput]
})
export class AppointmentPage implements OnInit {
	loading: boolean = false;

	appointment = inject(AppointmentService);

	appointments: any[] = [];

	@ViewChild('cancelModal', { static: false }) cancelModal!: IonModal;

	selectedDoctor: any = null;

	selectedAppointmentId: number | null = null;
	
	private destroy$ = new Subject<void>();

	ellipsesVertical = ellipsisVerticalOutline;

	actionSheetCtrl = inject(ActionSheetController);

	toastService = inject(ToastService);

	@ViewChild('updateAppointment', { static: true }) updateAppointmentModal!: IonModal;

	selectedAppointment: any = null;

	doctor: any = null;

	myForm!: FormGroup;
	
	fb = inject(FormBuilder);

	appointmentDateDisplay: string = '';

	showDatePicker = false;

	appointmentDate = new Date().toISOString().split('T')[0];

	today = new Date().toISOString().split('T')[0];

	availableSlots: string[] = [];

	selectedSlot: string = '';
	
	constructor() { 

		this.myForm = this.fb.group({
			doctor_id: [''],
			patient_id: [''],
			appointment_date: [''],
			time_slot: ['']
		});
	}

	ngOnInit() {
		this.loadAppointments();
		this.getAvailableSlots();

		this.appointment.shouldRefresh.subscribe(refresh => {
			if (refresh) {
			  this.loadAppointments();
			  this.appointment.shouldRefresh.next(false); // reset
			}
		  });
	}
	loadAppointments() {
		this.loading = true;
		this.appointment.getAllAppointments()
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 2000))
		)
		  .subscribe({
			next: (response: any) => {
			  this.appointments = this.groupAppointmentsByDoctor(response.data);
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
	cancelAppointment(appointmentId: any) {
		this.appointment.cancelAppointment(appointmentId)
			.pipe(
				finalize(() => setTimeout(() => this.loading = false, 3000))
			)
			.subscribe({
				next: (response: any) => {
					if (response.status === "success") {
						this.toastService.presentSuccessToast(response.message);
						this.loading = false;

						this.loadAppointments();
					} else {
						console.log('else')
						this.toastService.presentErrorToast(response.message);
						this.loading = false;
					}
				},
				error: (err) => {
					console.error('Failed to load appointments:', err.message);
				}
			})
	}

	changeAppointment(appointmentId: number) {
		let data:any = {
			appointmentDate: this.myForm.value.appointment_date,
			timeslot: this.myForm.value.time_slot,
			status: "pending"
		}
		this.appointment.updateAppointment(appointmentId, data)
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 3000))
		)
		.subscribe({
			next: (response: any) => {
				if (response.status === "success") {
					this.toastService.presentSuccessToast(response.message);
					this.loading = false;
					this.updateAppointmentModal.dismiss();

					this.loadAppointments();
				} else {
					console.log('else')
					this.toastService.presentErrorToast(response.message);
					this.loading = false;
				}
			},
			error: (err) => {
				console.error('Failed to load appointments:', err.message);
			}
		})

	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
  	
	async presentActionSheet(appointmentId: number, appointment: any, doctor: any) {

		const actionSheet = await this.actionSheetCtrl.create({
		  header: 'Options',
		  mode: 'md',
		  buttons: [
			
			{
				text: 'Cancel Appointment?',
				handler: () => {
					this.cancelAppointment(appointmentId)
				},
			},
			{
				text: 'Update Appointment?',
				handler: () => {
					this.selectedAppointment = appointment;
					this.doctor = doctor;
					this.populateForm(appointment);
					this.updateAppointmentModal.present();
				  },
			},
		  ],
		});
	
		await actionSheet.present();
	  }
	populateForm(appointment: any) {
		this.myForm.patchValue({
		  appointment_date: appointment.appointmentDate,
		  time_slot: appointment.timeslot,
		});
	}
	cancel() {
		this.updateAppointmentModal.dismiss(null, 'cancel');
	}
	getAvailableSlots() {
		this.appointment.getAvailableSlots(<any>this.doctor?.id, this.appointmentDate)
		.subscribe((res: any) => {

			this.availableSlots = res;


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

	handleRefresh(event: CustomEvent) {
		setTimeout(() => {
		  this.loadAppointments();
		  (event.target as HTMLIonRefresherElement).complete();
		}, 2000);
	}
}
