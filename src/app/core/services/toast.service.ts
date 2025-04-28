import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastCtrl = inject(ToastController)
  async presentErrorToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: 'danger',
      icon: 'close-circle-outline',
    });

    await toast.present();
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
    });

    await toast.present();
  }
}
