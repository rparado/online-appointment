import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.page.html',
  styleUrls: ['./medical-record.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MedicalRecordPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
