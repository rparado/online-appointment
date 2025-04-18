// import { inject, Injectable } from '@angular/core';
// import { Subject, Observable } from 'rxjs';
// import { first } from 'rxjs/operators';
// import { PopoverController } from '@ionic/angular/standalone';
// import { DialogGenericConfirmComponent, DialogGenericMessageComponent } from '@bauerfeind/shared/components';

// interface DialogParams {
//     headingText: string;
//     bodyText?: string;
//     labelYes?: string;
// }

// interface DialogConfirmParams extends DialogParams {
//     labelNo?: string;
//     mode?: '' | 'deleteButton' | 'primaryButton';
// }

// @Injectable({
//     providedIn: 'root',
// })
// export class DialogService {
//     popoverCtrl = inject(PopoverController);

//     constructor() {}

//     openMessageDialog(params: DialogParams): Observable<boolean> {
//         const { headingText = '', bodyText = '', labelYes = 'ok' } = params;

//         const confirmationSubject = new Subject<boolean>();
//         const confirmation = confirmationSubject.asObservable();

//         this.popoverCtrl
//             .create({
//                 component: DialogGenericMessageComponent,
//                 cssClass: ['confirmation-dialog', 'app-popover'],
//                 mode: 'md',
//                 showBackdrop: true,
//                 componentProps: {
//                     headingText,
//                     bodyText,
//                     labelYes,
//                 },
//             })
//             .then((popover) => {
//                 popover.present();
//                 popover.onDidDismiss().then(() => {
//                     confirmationSubject.next(true);
//                 });
//             });

//         return confirmation.pipe(first());
//     }

//     openConfirmDialog(params: DialogConfirmParams): Observable<boolean> {
//         const { headingText = '', bodyText = '', labelYes = 'yes', labelNo = 'no', mode = '' } = params;

//         const confirmationSubject = new Subject<boolean>();
//         const confirmation = confirmationSubject.asObservable();

//         this.popoverCtrl
//             .create({
//                 component: DialogGenericConfirmComponent,
//                 cssClass: ['confirmation-dialog', 'app-popover'],
//                 mode: 'md',
//                 showBackdrop: true,
//                 componentProps: {
//                     headingText,
//                     bodyText,
//                     labelYes,
//                     labelNo,
//                     mode: mode,
//                 },
//             })
//             .then((popover) => {
//                 popover.present();
//                 popover.onDidDismiss().then((data: any) => {
//                     confirmationSubject.next(data['data']?.confirm || false);
//                 });
//             });

//         return confirmation.pipe(first());
//     }
// }
