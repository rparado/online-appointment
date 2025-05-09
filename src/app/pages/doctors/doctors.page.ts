import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonAvatar, IonInfiniteScroll, InfiniteScrollCustomEvent, IonList, IonLabel, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { DoctorService } from '@oda/core/services/doctors/doctor.service';
import { Doctor } from 'src/app/models/Doctor';
import { InitialsPipe } from "../../core/pipes/initials.pipe";
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
	selector: 'app-doctors',
	templateUrl: './doctors.page.html',
	styleUrls: ['./doctors.page.scss'],
	standalone: true,
	imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonAvatar, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PageStandardPage, IonList, IonLabel, InitialsPipe, RouterModule]
})
export class DoctorsPage implements OnInit {
	loading: boolean = false;

	doctors = inject(DoctorService);

	doctorList: any[] = [];

	constructor() { }

	ngOnInit() {
	this.getDoctors();
	}

	getDoctors() {
	this.loading = true;

	this.doctors.getDoctors()
		.pipe(
			finalize(() => setTimeout(() => this.loading = false, 1000))
		)
		.subscribe({
			next: (doctors: Doctor[]) => {
				this.doctorList = doctors;

			},
			error: (err) => {
				console.error('Failed to load doctors:', err.message);
			}
		});
	}
	private generateItems() {
		const count = this.doctorList.length + 1;
		for (let i = 0; i < 50; i++) {
			this.doctorList.push(`Item ${count + i}`);
		}
	}
	onIonInfinite(event: InfiniteScrollCustomEvent) {
	this.generateItems();
		setTimeout(() => {
			event.target.complete();
		}, 500);
	}

}
