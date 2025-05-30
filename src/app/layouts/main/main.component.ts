import { Component, inject, OnInit } from '@angular/core';
import { IonIcon, IonTabButton, IonTabs, IonTabBar, ActionSheetController, NavController } from "@ionic/angular/standalone";
import { personCircleOutline, peopleOutline, listCircleOutline, settings, calendarOutline } from 'ionicons/icons';
import { PATH } from '../../configs/path';
import { StorageService } from '@oda/core/services/storage/storage.service';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
	imports: [IonTabBar, IonIcon, IonTabButton, IonTabs]
})
export class MainComponent  implements OnInit {
	profileIcon = personCircleOutline;
	doctorsIcon = peopleOutline;
	appointmentsIcon = listCircleOutline;
	settingsIcon = settings;
	calendarIcon = calendarOutline;

	actionSheetCtrl = inject(ActionSheetController);

	navCtrl = inject(NavController);

	isProfileUpdated = 0;

	role: string = '';

	storageService = inject(StorageService);

	constructor() { }

	ngOnInit() {
		const userJson:any = this.storageService.get('user');
		const user = userJson ? JSON.parse(userJson) : null;

		console.log('user ', user)
		this.isProfileUpdated = user.isProfileUpdated;
		this.role = user.role;

		console.log('this.role ', this.role)
	}
	async presentActionSheet() {
			const actionSheet = await this.actionSheetCtrl.create({
			  header: 'Options',
			  mode: 'md',
			  buttons: [
				
				{
					text: 'Profile',
					handler: () => {
						this.profilePage(); 
					},
				},
				{
					text: 'Logout',
					role: 'destructive',
					handler: () => {
						this.logout(); 
					},
				},
			  ],
			});
		
			await actionSheet.present();
		  }
		async logout() {
			this.storageService.delete('token');
			this.storageService.delete('user');
			this.navCtrl.navigateRoot([`${PATH.INTRO}`]);
		}
		profilePage() {
			this.navCtrl.navigateRoot([`/apps/${PATH.PROFILE}`]);
		}
}
