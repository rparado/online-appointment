import { Component, OnInit } from '@angular/core';
import { IonIcon, IonTabButton, IonTabs, IonTabBar } from "@ionic/angular/standalone";
import { personCircleOutline, peopleOutline, listCircleOutline, settings } from 'ionicons/icons';


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

	constructor() { }

	ngOnInit() {}

}
