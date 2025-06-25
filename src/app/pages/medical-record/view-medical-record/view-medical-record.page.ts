import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, AlertController, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButtons } from '@ionic/angular/standalone';
import { SafeUrlPipe } from "../../../core/pipes/safe-url.pipe";
import { DomSanitizer } from '@angular/platform-browser';


@Component({
	selector: 'app-view-medical-record',
	templateUrl: './view-medical-record.page.html',
	styleUrls: ['./view-medical-record.page.scss'],
	standalone: true,
	imports: [IonButtons, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ViewMedicalRecordPage implements OnInit {

	@Input() record: any;

	modalCtrl = inject(ModalController);

	alertCtrl = inject(AlertController);

	sanitizer = inject(DomSanitizer);

	constructor() { }

	ngOnInit() {
	}
	close() {
		this.modalCtrl.dismiss();
	}
}
