import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonNav, IonLabel, IonButton, NavController, IonDatetime, IonModal, IonRadioGroup, IonRadio, IonItem, IonText } from '@ionic/angular/standalone';
import { PageStandardPage } from 'src/app/layouts/page-standard/page-standard.page';
import { ToastService } from '@oda/core/services/toast.service';
import { UserService } from '@oda/core/services/user/user.service';
import { PATH } from '@oda/config/path';

@Component({
	selector: 'app-profile-update',
	templateUrl: './profile-update.page.html',
	styleUrls: ['./profile-update.page.scss'],
	standalone: true,
	imports: [IonText, IonItem, IonRadio, IonRadioGroup, IonModal, IonDatetime, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput, IonNav, PageStandardPage, IonLabel ]
	
})
export class ProfileUpdatePage implements OnInit  {
	loading = false;

	toastService = inject(ToastService);

	navCtrl = inject(NavController);
	
	fb = inject(FormBuilder);

	showError = false;

	showDatePicker = false;

	userService = inject(UserService);

	myForm: FormGroup = this.fb.group({
		avatar: [''],
		user_id: [''],
		f_name: ['', Validators.compose([Validators.required])],
		m_name: ['', Validators.compose([Validators.required])],
		l_name: ['', Validators.compose([Validators.required])],
		dob: ['', Validators.compose([Validators.required])],
		age: ['',],
		phone_number: ['', Validators.compose([Validators.required])],
		address: ['', Validators.compose([Validators.required])],
		gender: ['', Validators.compose([Validators.required])]
	});


	selectedFile: File | null = null;

	imagePreview: string | ArrayBuffer | null = null;


	@ViewChild('dobPicker') dobPicker!: IonDatetime;

	dobDisplay: string = '';
	
	constructor() { }

	ngOnInit() {
	}


	onFileSelected(event: any) {
		const file = event.target.files[0];
		if (file) {
		  this.selectedFile = file;
	
		  const reader = new FileReader();
		  reader.onload = () => {
			this.imagePreview = reader.result;
		  };
		  reader.readAsDataURL(file);
		}
	}
	onDobChange(event: any) {
		const rawDate = event.detail.value;
  
		if (!rawDate) return;
	  
		const formattedDate = rawDate.split('T')[0]; // Ensure we only keep the 'YYYY-MM-DD' part
		this.dobDisplay = formattedDate;
	  
		this.myForm.get('dob')?.setValue(formattedDate);
	  
		const selectedDate = new Date(formattedDate);
		const age = this.calculateAge(selectedDate);
		this.myForm.get('age')?.setValue(age);
	  
		this.showDatePicker = false;
	}
	calculateAge(dob: Date): number {
		const today = new Date();
		let age = today.getFullYear() - dob.getFullYear();
		const m = today.getMonth() - dob.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
			age--;
		}
		return age;
	}

	onUpdate() {
		const formData = new FormData();
		Object.entries(this.myForm.value).forEach(([key, value]) => {
		  formData.append(key, value as string);
		});
	
		if (this.selectedFile) {
		  formData.append('avatar', this.selectedFile);
		}
	
		if (this.myForm.invalid) {
			return; 
		}

		const userString  = localStorage.getItem('user');
		const user = userString ? JSON.parse(userString) : null;

		const userData = {
			userId: user.id,
			firstName: this.myForm.value.f_name,
			middleName: this.myForm.value.m_name,
			lastName: this.myForm.value.l_name,
			birthDate: this.myForm.value.dob,
			age: this.myForm.value.age,
			phoneNumber: this.myForm.value.phone_number,
			avatar: this.myForm.value.avatar,
			address: this.myForm.value.address,
			gender: this.myForm.value.gender,
		}
		
		this.userService.updateProfile(user.id, userData)
		.subscribe({
		next: (data: any) => {
			console.log('data ', data)

			if (data.status === "success") {
				this.toastService.presentSuccessToast(data.message);
				this.loading = false;

				this.navCtrl.navigateForward(PATH.APPOINTMENTS)

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
