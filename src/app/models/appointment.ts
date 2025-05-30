export interface Appointment {
    id?: number;
    patientId: number;
    appointmentDate: string; // ISO date
    timeslot: string;
    status?: string;
    remarks?: string;
  }