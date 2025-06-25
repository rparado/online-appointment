import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon,IonList, IonItem, IonLabel, IonButtons, IonButton, IonText, ModalController } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { finalize, Subscription } from 'rxjs';
import { MedicalRecordService } from '@oda/core/services/medical-record/medical-record.service';
import { eyeOutline, downloadOutline, documentTextOutline } from 'ionicons/icons';
import { ViewMedicalRecordPage } from './view-medical-record/view-medical-record.page';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileViewer } from '@capacitor/file-viewer';
import { Capacitor } from '@capacitor/core';

@Component({
	selector: 'app-medical-record',
	templateUrl: './medical-record.page.html',
	styleUrls: ['./medical-record.page.scss'],
	standalone: true,
	imports: [IonText, IonButton, IonButtons, IonLabel, IonItem, IonList, CommonModule, PageStandardPage, IonIcon]
})
export class MedicalRecordPage implements OnInit {

		eyeOutline = eyeOutline;

		downloadOutline = downloadOutline;

		documentTextOutline = documentTextOutline;

		loading: boolean = false;

		MedicalRecordListSubs!:Subscription;

		medService = inject(MedicalRecordService);

		medicalRecords: any;

		 modalCtrl = inject(ModalController);

		constructor() { 

		}

		ngOnInit() {
			this.loading = true;
			this.MedicalRecordListSubs = this.medService.getMedicalRecords()
				.pipe(
					finalize(() => setTimeout(() => this.loading = false, 1000))
				)
				.subscribe({
					next: res => {
						console.log('res ', res.data)
						this.loading = false;
						if(res.status === 'success') {
							this.medicalRecords = res.data;
						}
						
					},
					error: err => {
						//this.toastService.presentSuccessToast(err.message)
					}
				});

		}
		async openRecordModal(record: any) {
			console.log('record ', record)
			const modal = await this.modalCtrl.create({
				component: ViewMedicalRecordPage,
				componentProps: { record },
			});

			await modal.present();

			const { data, role } = await modal.onDidDismiss();

			if (role === 'confirm' && data) {
				console.log('Modal returned data:', data);
			}
		}

		ngOnDestroy(): void {
			this.MedicalRecordListSubs.unsubscribe();
		}

		async download(url: string, filename: string) {
			const platform = Capacitor.getPlatform();

			console.log('platform ', platform)

			if (platform === 'web') {
				const fileUrl = `${url}/${filename}`;

				// Preview in iframe
				const iframe = document.createElement('iframe');
				iframe.src = fileUrl;
				iframe.width = '100%';
				iframe.height = '600px';
				document.getElementById('pdf-preview')?.appendChild(iframe);

				// Trigger download
				const a = document.createElement('a');
				a.href = fileUrl;
				a.download = filename;
				a.style.display = 'none'; // hide the anchor
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			} else {
				try {
				const response = await fetch(`${url}/${filename}`);
				const blob = await response.blob();

				const reader = new FileReader();

				reader.onloadend = async () => {
					const result = reader.result;

					if (typeof result === 'string') {
					const base64 = result.split(',')[1];

					await Filesystem.writeFile({
						path: filename,
						data: base64,
						directory: Directory.Documents,
					});

					const { uri } = await Filesystem.getUri({
						directory: Directory.Documents,
						path: filename,
					});

						// Open the PDF using FileViewer
						await FileViewer.openDocumentFromLocalPath({ path: uri });
					} else {
					console.error('Failed to convert file to base64.');
					}
				};

				reader.readAsDataURL(blob);
				} catch (error) {
				console.error('Download failed', error);
				}
			}
		}
		
}

