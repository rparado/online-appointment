import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { addCircleOutline } from 'ionicons/icons';
@Component({
	selector: 'app-medical-record',
	templateUrl: './medical-record.page.html',
	styleUrls: ['./medical-record.page.scss'],
	standalone: true,
	imports: [IonFab, IonFabButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PageStandardPage]
})
export class MedicalRecordPage implements OnInit {
		loading: boolean = false;

		addIcon = addCircleOutline;

		myForm!: FormGroup;

		fb = inject(FormBuilder)
		
		constructor() { 
			this.myForm = this.fb.group({
				patient_name: ['', Validators.compose([Validators.required])],
				
			});
		}

		ngOnInit() {
		}

}
