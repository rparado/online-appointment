import { Component, inject, input } from '@angular/core';
import {
    IonProgressBar,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonFooter} from '@ionic/angular/standalone';
import { PATH } from '../../configs/path';

import { settingsOutline } from 'ionicons/icons';
import { UserService } from '@oda/core/services/user/user.service';

@Component({
	selector: 'app-page-standard',
	templateUrl: './page-standard.page.html',
	styleUrls: ['./page-standard.page.scss'],
	standalone: true,
	imports: [IonFooter, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, IonProgressBar, IonContent]
})
export class PageStandardPage {

	settingsIcon = settingsOutline;

	pageTitle = input('');

	loading = input(false);

	showBackButton = input(true);

	showFooter = input(true);

	backButtonDefaultHref = input(PATH.APP_REDIRECTION);

	showProfileBtn = input(false);



	userService = inject(UserService);


	constructor() { }

}	
