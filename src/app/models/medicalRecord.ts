export interface MedicalRecord {
    id?: number;
    patientId: number;
    doctorId: number;
    appointmentId: number;
    treatment?: string;
    diagnosis?: string;
    prescription?: string;
    notes?: string;
    file?: string;
    followup_date?:string;
  }