import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonLabel, IonItem, IonCardHeader, IonCardTitle, IonCardContent,IonCard, IonSelect, IonSelectOption, IonButton, IonButtons, IonModal, IonDatetime, IonFabButton, IonIcon, IonFab, IonList, IonText, ActionSheetController, IonTextarea, ModalController  } from '@ionic/angular/standalone';
import { PageStandardPage } from "../../layouts/page-standard/page-standard.page";
import { AppointmentService } from '@oda/core/services/appointment/appointment.service';
import { format } from 'date-fns';
import { addCircleOutline, calendarOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';
import { ToastService } from '@oda/core/services/toast.service';
import { FormPage } from '../medical-record/form/form.page';

@Component({
	selector: 'app-doctors-appointment',
	templateUrl: './doctors-appointment.page.html',
	styleUrls: ['./doctors-appointment.page.scss'],
	standalone: true,
	imports: [IonTextarea, IonText, IonList, IonFab, IonIcon, IonFabButton, IonDatetime, IonButtons, IonButton, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonItem, IonLabel, IonRefresherContent, IonRefresher, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PageStandardPage, IonSelect, IonSelectOption, IonModal, ReactiveFormsModule, FormsModule]
})
export class DoctorsAppointmentPage implements OnInit {
	loading: boolean = false;

	selectedDate: string = '';

  	appointments: any[] = [];

	message: string = '';

	appointmentService = inject(AppointmentService);

	@ViewChild('dateModal', { static: false }) dateModal!: IonModal;

	@ViewChild('updateAppointment', { static: true }) updateAppointmentModal!: IonModal;

	calendarIcon = calendarOutline;

	ellipsesVertical = ellipsisVerticalOutline;
	
	addPlusOutline = addCircleOutline;

	today = new Date().toISOString().split('T')[0];

	myForm!: FormGroup;
	
	fb = inject(FormBuilder);

	actionSheetCtrl = inject(ActionSheetController);

	selectedAppointment: any = null;

	toastService = inject(ToastService);

	patient: any = null;

	selectedStatus: string = '';

	modalCtrl = inject(ModalController);

	appointment: any;
	
	constructor() { 
		this.myForm = this.fb.group({
			status: ['cancelled'],
			remarks: ['']
		});
	}

	ngOnInit() {
		const today = new Date();
    	this.selectedDate = format(today, 'yyyy-MM-dd');
		this.loadAppointments();
	}
	handleRefresh(event: CustomEvent) {
		setTimeout(() => {
		  this.loadAppointments();
		  (event.target as HTMLIonRefresherElement).complete();
		}, 2000);
	}

	loadAppointments() {
		this.loading = true;
		this.appointmentService.getDoctorAppointments(this.selectedDate)
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 3000))
		)
		.subscribe({
			next: (res: any) => {
				if(res.data.length) {
					this.appointments = this.groupAppointmentsByPatient(res.data);
				} else {
					this.appointments = [];
				}
				this.message = res.message;
			},
			error: (err) => console.error(err),
		});
	}
	 getStatusColor(status: string): string {
		switch (status) {
			case 'completed': return 'success';
			case 'cancelled': return 'danger';
			default: return 'warning';
		}
  	}

	 openDateModal() {
		this.dateModal.present();
	}

	closeDateModal() {
		this.dateModal.dismiss();
	}
	onDateChange(event: any) {
		this.dateModal.dismiss();
		this.loadAppointments();
	}
	groupAppointmentsByPatient(appointments: any[]): any[] {
		const grouped = new Map();
	
		for (const appt of appointments) {
		const key = appt.patientId;
		if (!grouped.has(key)) {
			grouped.set(key, {
			patient: appt.patient,
			appointments: []
			});
		}
		grouped.get(key).appointments.push(appt);
		}
	
		return Array.from(grouped.values());
	}
	openUpdateModal() {
		this.updateAppointmentModal.present();
	}
	cancel() {
		this.updateAppointmentModal.dismiss(null, 'cancel');
	}
	async presentActionSheet(appointmentId: number, appointment: any, patient: any) {

		const buttons = [
			{
				text: 'Change',
				handler: () => {
					this.selectedAppointment = appointment;
					this.patient = patient;
					this.updateAppointmentModal.present();
				},
			}
		];

		// Only add "Add Medical Record" button if appointment is completed
		if (appointment.status === 'completed') {
			buttons.push({
				text: 'Add Medical Record',
				handler: () => {
					// Your logic here, e.g. open medical record modal
				}
			});
		}

		const actionSheet = await this.actionSheetCtrl.create({
			header: 'Update your appointment',
			mode: 'md',
			buttons: buttons,
		});

		await actionSheet.present();
	}

	changeAppointment(appointmentId: number) {
		let data:any = {
			status: this.myForm.value.status,
			remarks: this.myForm.value.remarks,
		}
		this.appointmentService.updateDoctorAppointment(appointmentId, data)
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 3000))
		)
		.subscribe({
			next: (response: any) => {
				if (response.status === "success") {
					this.toastService.presentSuccessToast(response.message);
					this.loading = false;
					this.updateAppointmentModal.dismiss();
					 this.myForm.reset({
						status: 'cancelled',
						remarks: ''
					});

					this.loadAppointments();
				} else {
					this.toastService.presentErrorToast(response.message);
					this.loading = false;
				}
			},
			error: (err) => {
				console.error('Failed to load appointments:', err.message);
			}
		})

	}
	onStatusChange(event: any) {
		this.selectedStatus = event.detail.value;
	}

	async openMedicalModal(appt: any) {
		const modal = await this.modalCtrl.create({
		component: FormPage,
		componentProps: {
			appointment: appt,
		},
	});

	await modal.present();

		const { data } = await modal.onDidDismiss();
		console.log('Returned data:', data);
	}
}
