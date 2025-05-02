import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonImg, IonRow, IonGrid, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '@oda/core/services/doctors/doctor.service';
import { finalize } from 'rxjs';
import { Doctor } from 'src/app/models/Doctor';

@Component({
	selector: 'app-doctor-detail',
	templateUrl: './doctor-detail.page.html',
	styleUrls: ['./doctor-detail.page.scss'],
	standalone: true,
	imports: [IonCardSubtitle, IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonRow, IonImg, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,PageStandardPage, IonGrid, IonCol]
})
export class DoctorDetailPage implements OnInit {
	loading: boolean = false;

	fb = inject(FormBuilder);

	route = inject(ActivatedRoute);

	doctorService = inject(DoctorService);

	doctor?: Doctor;

	myForm: FormGroup = this.fb.group({
			avatar: [''],
			user_id: [''],
			f_name: ['', Validators.compose([Validators.required])],
			m_name: ['', Validators.compose([Validators.required])],
			l_name: ['', Validators.compose([Validators.required])],
			dob: ['', Validators.compose([Validators.required])],
			age: ['',],
			phone_number: ['', Validators.compose([Validators.required])],
			address: ['', Validators.compose([Validators.required])],
			gender: ['male', Validators.compose([Validators.required])]
		});
	
	constructor() { }

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
	}

	submit() {

	}

}
