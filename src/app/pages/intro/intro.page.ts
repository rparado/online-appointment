import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, NavController } from '@ionic/angular/standalone';
import { PATH } from '@oda/config/path';
import { Storage } from '@ionic/storage';
import { StorageService } from '@oda/core/services/storage/storage.service';

@Component({
	selector: 'app-intro',
	templateUrl: './intro.page.html',
	styleUrls: ['./intro.page.scss'],
	standalone: true,
	imports: [IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonButton,  ReactiveFormsModule]
})
export class IntroPage implements OnInit {
	navCtrl = inject(NavController);
	fb = inject(FormBuilder);
	storage = inject(Storage);
	storageService = inject(StorageService);
	
	myForm: FormGroup = this.fb.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required])],
    });


	constructor() { 
		this.myForm.patchValue({
            email: '',
            password: '',
        });
	}

	ngOnInit() {
	}
	gotoRegister() {
		this.navCtrl.navigateForward(PATH.REGISTER);
	}
	onLogin() {
		const formValue = this.myForm.value;
		console.log('formValue ', formValue)

	}
}
