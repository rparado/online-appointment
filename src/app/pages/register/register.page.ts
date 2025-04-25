import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonNav, IonLabel } from '@ionic/angular/standalone';
import { UserService } from '@oda/core/services/user/user.service';
import { PageStandardPage } from '../../layouts/page-standard/page-standard.page';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, ReactiveFormsModule, IonInput, IonNav, PageStandardPage, IonLabel ]
})
export class RegisterPage implements OnInit {
	fb = inject(FormBuilder);
	//storage = inject(Storage);  
	userService = inject(UserService);

	myForm: FormGroup = this.fb.group({
		email: ['', Validators.compose([Validators.required, Validators.email])],
		password: ['', Validators.compose([Validators.required])],
	});
	loading: boolean = false;

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
	const email = this.myForm.value.email;
	const password = this.myForm.value.password;

	this.userService.registerUser(email, password)
		.subscribe(data => {
			if(!data) {
				this.loading = false;
			}
		}, err => {
			console.log(err)
		})
  }
}
