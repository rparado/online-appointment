import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { closeOutline, checkmarkCircleOutline, warningOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastCtrl = inject(ToastController)
  async presentErrorToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'danger',
      icon: warningOutline,
      buttons: [
        {
          icon: closeOutline,
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'success',
      icon: checkmarkCircleOutline,
      buttons: [
        {
          icon: closeOutline,
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }
}
