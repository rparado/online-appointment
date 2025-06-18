import { Component, inject, OnInit } from '@angular/core';
import { IonIcon, IonTabButton, IonTabs, IonTabBar, ActionSheetController, NavController } from "@ionic/angular/standalone";
import { personCircleOutline, peopleOutline, listCircleOutline, settings, calendarOutline, documentOutline } from 'ionicons/icons';
import { PATH } from '../../configs/path';
import { StorageService } from '@oda/core/services/storage/storage.service';
import { Subscription } from 'rxjs';
import { UserService } from '@oda/core/services/user/user.service';

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
	fileIcon = documentOutline;

	actionSheetCtrl = inject(ActionSheetController);

	navCtrl = inject(NavController);

	isProfileUpdated = 0;

	role: string = '';

	storageService = inject(StorageService);

	userService = inject(UserService);

	userSub: Subscription | undefined;

	constructor() { }

	ngOnInit() {
		// const userJson:any = localStorage.getItem('user');
		// const user = userJson ? JSON.parse(userJson) : null;

		// this.isProfileUpdated = user.isProfileUpdated;
		// this.role = user.role;

		this.userSub = this.userService.currentUser$.subscribe(user => {
			if (user) {
				this.isProfileUpdated = user.isProfileUpdated;
				this.role = user.role;
			}
		});

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
			await this.userService.logout();
		}
		profilePage() {
			this.navCtrl.navigateRoot([`/apps/${PATH.PROFILE}`]);
		}

		ngOnDestroy(): void {
			//Called once, before the instance is destroyed.
			//Add 'implements OnDestroy' to the class.
			this.userSub?.unsubscribe();
		}
}
