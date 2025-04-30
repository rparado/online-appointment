import { Component, inject, input, OnInit } from '@angular/core';
import {
    IonProgressBar,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonFooter, IonIcon, IonButton, ActionSheetController, NavController } from '@ionic/angular/standalone';
import { PATH } from '../../configs/path';

import { settingsOutline } from 'ionicons/icons';
import { StorageService } from '@oda/core/services/storage/storage.service';
import { UserService } from '@oda/core/services/user/user.service';

@Component({
	selector: 'app-page-standard',
	templateUrl: './page-standard.page.html',
	styleUrls: ['./page-standard.page.scss'],
	standalone: true,
	imports: [IonButton, IonIcon, IonFooter, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, IonProgressBar, IonContent]
})
export class PageStandardPage {

	settingsIcon = settingsOutline;

	pageTitle = input('');

	loading = input(false);

	showBackButton = input(true);

	backButtonDefaultHref = input(PATH.APP_REDIRECTION);

	showProfileBtn = input(false);

	actionSheetCtrl = inject(ActionSheetController);

	storageService = inject(StorageService);

	userService = inject(UserService);

	navCtrl = inject(NavController);

	constructor() { }

	
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
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		this.navCtrl.navigateRoot([`${PATH.INTRO}`]);
	}
	profilePage() {
		this.navCtrl.navigateRoot([`${PATH.PROFILE}`]);
	}
}	
