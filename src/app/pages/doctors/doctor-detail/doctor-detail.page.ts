import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';

@Component({
	selector: 'app-doctor-detail',
	templateUrl: './doctor-detail.page.html',
	styleUrls: ['./doctor-detail.page.scss'],
	standalone: true,
	imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,PageStandardPage]
})
export class DoctorDetailPage implements OnInit {
	loading: boolean = false;

	fb = inject(FormBuilder);

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
	}

	submit() {

	}

}
