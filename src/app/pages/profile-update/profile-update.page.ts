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
		gender: ['male', Validators.compose([Validators.required])]
	});


	selectedFile: File | null = null;

	imagePreview: string | ArrayBuffer | null = null;


	@ViewChild('dobPicker') dobPicker!: IonDatetime;

	dobDisplay: string = '';
	
	today: string = '';

	constructor() { }

	ngOnInit() {
		const now = new Date();
  		this.today = now.toISOString().split('T')[0];
	}


	onFileSelected(event: any) {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];

			const reader = new FileReader();
			reader.onload = () => {
			this.imagePreview = reader.result;
			};
			reader.readAsDataURL(this.selectedFile);
		}
	}
	onDobChange(event: any) {
		const rawDate = event.detail.value;
  
		if (!rawDate) return;
	  
		const formattedDate = rawDate.split('T')[0];
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
	
		if (this.myForm.invalid) {
			return; 
		}

		const userString  = localStorage.getItem('user');
		const user = userString ? JSON.parse(userString) : null;

		const formData: any = new FormData();
		formData.append('firstName', this.myForm.value.f_name);
		formData.append('middleName', this.myForm.value.m_name);
		formData.append('lastName', this.myForm.value.l_name);
		formData.append('birthDate', this.myForm.value.dob);
		formData.append('age', this.myForm.value.age);
		formData.append('phoneNumber', this.myForm.value.phone_number);
		formData.append('address', this.myForm.value.address);
		formData.append('gender', this.myForm.value.gender);
	  
		if (this.selectedFile) {
		  formData.append('avatar', this.selectedFile);
		}
		
		this.userService.updateProfile(user.id, formData)
		.subscribe({
		next: (data: any) => {

			if (data.status === "success") {
				this.toastService.presentSuccessToast(data.message);
				this.loading = false;

				this.navCtrl.navigateForward(PATH.DOCTORS)

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
