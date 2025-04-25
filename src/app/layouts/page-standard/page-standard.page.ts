import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonProgressBar,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonFooter,
} from '@ionic/angular/standalone';
import { PATH } from '../../configs/path';

@Component({
	selector: 'app-page-standard',
	templateUrl: './page-standard.page.html',
	styleUrls: ['./page-standard.page.scss'],
	standalone: true,
	imports: [IonFooter, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, IonProgressBar, IonContent]
})
export class PageStandardPage {

	constructor() { }

	pageTitle = input('');

	loading = input(false);

	showBackButton = input(true);

	backButtonDefaultHref = input(PATH.APP_REDIRECTION);
}
