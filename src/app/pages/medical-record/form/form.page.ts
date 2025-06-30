import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,  IonButtons, IonButton, ModalController, IonLabel, IonText,  IonDatetime, IonModal, IonInput } from '@ionic/angular/standalone';
import { MedicalRecordService } from '@oda/core/services/medical-record/medical-record.service';
import { finalize } from 'rxjs';
import { ToastService } from '@oda/core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: true,
  imports: [IonModal, IonDatetime, IonText, IonLabel, IonButton, IonButtons,  IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput]
})
export class FormPage implements OnInit {
	@Input() appointment: any;

	modalCtrl = inject(ModalController);

	fb = inject(FormBuilder);

	dateDisplay: string = '';

	myForm: FormGroup = this.fb.group({
		diagnosis: ['', Validators.compose([Validators.required])],
		treatment: ['', Validators.compose([Validators.required])],
		prescription: ['', Validators.compose([Validators.required])],
		note: [''],
		followup_date: ['', Validators.compose([Validators.required])],
		file: [''],
	});

	showDatePicker = false;

	today: string = '';

	imagePreview: string | null = null;
	isPdf: boolean = false;
	pdfFileName: string | null = null;

	selectedFile: File | null = null;

	medService = inject(MedicalRecordService);

	appointmentId: number = 0;
	patientId: number = 0;
	doctorId: number = 0;

	loading: boolean = false;

	toastService = inject(ToastService);

	router = inject(Router);

	constructor() { }

	ngOnInit() {

		const now = new Date();
  		this.today = now.toISOString().split('T')[0];

		this.appointmentId = this.appointment.id;
		this.patientId = this.appointment.patientId;
		this.doctorId = this.appointment.doctorId
	}
	cancel() {
 		return this.modalCtrl.dismiss(null, 'cancel');
	}
	confirm() {

		const formData: any = new FormData();

		
		formData.append('patientId', this.patientId);
		formData.append('doctorId', this.doctorId);
		formData.append('appointmentId', this.appointmentId);


		formData.append('treatment', this.myForm.value.treatment);
		formData.append('diagnosis', this.myForm.value.diagnosis);
		formData.append('prescription', this.myForm.value.prescription);
		formData.append('notes', this.myForm.value.note);
		formData.append('followup_date', this.myForm.value.followup_date);

	  
		if (this.selectedFile) {
		  formData.append('file', this.selectedFile);
		}

		console.log('formData ', formData)
		this.medService.createMedicalRecord(formData)
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 1000))
		)
		.subscribe({
			next: res => {
				this.loading = false;
				if(res.status === "success") {
					this.toastService.presentSuccessToast(res.message);
					this.router.navigateByUrl('/apps/medical-record');
				}
			// this.modalCtrl.dismiss(this.appointment, 'confirm');
			},
			error: err => {
				this.toastService.presentSuccessToast(err.message)
			}
		});
		//return this.modalCtrl.dismiss(this.appointment, 'confirm');

	}

	onDobChange(event: any) {
		const rawDate = event.detail.value;
  
		if (!rawDate) return;
	  
		const formattedDate = rawDate.split('T')[0];
		this.dateDisplay = formattedDate;
	  
		this.myForm.get('followup_date')?.setValue(formattedDate);
	  
	  
		this.showDatePicker = false;
	}
	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		if (!file) return;

		this.selectedFile = file;

		this.isPdf = file.type === 'application/pdf';
		if (this.isPdf) {
			this.imagePreview = null;
			this.pdfFileName = file.name;
		} else if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = () => {
			this.imagePreview = reader.result as string;
			};
			reader.readAsDataURL(file);
			this.pdfFileName = null;
		} else {
			this.imagePreview = null;
			this.pdfFileName = null;
			this.selectedFile = null;
			alert('Only image or PDF files are allowed.');
		}
	}
}
