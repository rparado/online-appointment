import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButtons, IonButton, ModalController, IonLabel, IonText, IonRadio, IonDatetime, IonModal, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: true,
  imports: [IonModal, IonDatetime, IonRadio, IonText, IonLabel, IonButton, IonButtons, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput]
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
		f_date: ['', Validators.compose([Validators.required])],
		file: ['', Validators.compose([Validators.required])],
	});

	showDatePicker = false;

	today: string = '';

	imagePreview: string | null = null;
	isPdf: boolean = false;
	pdfFileName: string | null = null;

	constructor() { }

	ngOnInit() {
		console.log('Appointment:', this.appointment);

		const now = new Date();
  		this.today = now.toISOString().split('T')[0];
	}
	cancel() {
 		return this.modalCtrl.dismiss(null, 'cancel');
	}
	confirm() {
		return this.modalCtrl.dismiss(this.appointment, 'confirm');

	}

	onDobChange(event: any) {
		const rawDate = event.detail.value;
  
		if (!rawDate) return;
	  
		const formattedDate = rawDate.split('T')[0];
		this.dateDisplay = formattedDate;
	  
		this.myForm.get('f_date')?.setValue(formattedDate);
	  
	  
		this.showDatePicker = false;
	}
	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		if (!file) return;

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
			alert('Only image or PDF files are allowed.');
		}
	}
}
