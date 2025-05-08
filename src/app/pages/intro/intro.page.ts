import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, NavController, IonFooter, IonButtons, IonIcon, IonImg, IonLabel } from '@ionic/angular/standalone';
import { PATH } from '@oda/config/path';
import { Storage } from '@ionic/storage';
import { StorageService } from '@oda/core/services/storage/storage.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '@oda/core/services/user/user.service';
import { ToastService } from '@oda/core/services/toast.service';

@Component({
	selector: 'app-intro',
	templateUrl: './intro.page.html',
	styleUrls: ['./intro.page.scss'],
	standalone: true,
	imports: [IonLabel, IonImg, IonIcon, IonButtons, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonButton,  ReactiveFormsModule, IonFooter, RouterModule ]
})
export class IntroPage implements OnInit {
	navCtrl = inject(NavController);

	fb = inject(FormBuilder);

	storage = inject(Storage);

	storageService = inject(StorageService);

	userService = inject(UserService);

	router = inject(Router);
	
	
	myForm: FormGroup = this.fb.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required])],
    });

	showError = false;
	
	loading: boolean = false;

	toastService = inject(ToastService);

	ngOnInit() {
		this.myForm.reset();
	}
	gotoRegister() {
		this.navCtrl.navigateForward(PATH.REGISTER);
	}
	onLogin() {
		this.loading = true;
		this.showError = true;
		const email = this.myForm.value.email;
		const password = this.myForm.value.password;
	
		if (this.myForm.invalid) {
			return; 
		}
	
		  this.userService.login(email, password)
		  .subscribe({
			next: (data) => {
				if (data.status === "success") {
					this.toastService.presentSuccessToast(data.message);
					this.loading = false;
	
					const targetTab = data.user.isProfileUpdated === 0 ? 'profile' : 'doctors';
					this.router.navigateByUrl(`/apps/${targetTab}`);
						
	
				} else {
					this.toastService.presentErrorToast(data.message);
					this.loading = false;
				}
			},
			error: (err) => {
			  console.log(err);
			  this.toastService.presentErrorToast(err);
			  this.loading = false;
			}
		  });
	  }
}
