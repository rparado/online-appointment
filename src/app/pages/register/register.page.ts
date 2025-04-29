import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonNav, IonLabel, NavController } from '@ionic/angular/standalone';
import { UserService } from '@oda/core/services/user/user.service';
import { PageStandardPage } from '../../layouts/page-standard/page-standard.page';
import { ToastService } from '@oda/core/services/toast.service';
import { PATH } from '@oda/config/path';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, ReactiveFormsModule, IonInput, IonNav, PageStandardPage, IonLabel ]
})
export class RegisterPage implements OnInit {
	fb = inject(FormBuilder);

	userService = inject(UserService);

	toastService = inject(ToastService);

	navCtrl = inject(NavController);


	myForm: FormGroup = this.fb.group({
		email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)])],
		password: ['', Validators.compose([Validators.required])],
	});
	loading: boolean = false;
	showError = false;

  constructor() { 
	this.myForm.patchValue({
		email: '',
		password: '',
	});
  }

  ngOnInit() {
  }
  onRegister() {
	this.loading = true;
	this.showError = true;
	const email = this.myForm.value.email;
	const password = this.myForm.value.password;

	if (this.myForm.invalid) {
		return; 
	  }

	  this.userService.register(email, password)
	  .subscribe({
		next: (data) => {

			if (data.status === "success") {
				this.toastService.presentSuccessToast(data.message);
				this.loading = false;

				this.navCtrl.navigateForward(PATH.PROFILE)

			} else {
				this.toastService.presentErrorToast(data.message);
				this.loading = false;
			}
		},
		error: (err) => {
		  console.log(err);
		  this.toastService.presentErrorToast('Error in submitting');
		  this.loading = false;
		}
	  });
  }
}
