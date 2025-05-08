import {UserProfile} from  '../models/User';

export interface Doctor {
    id?: number;
    fee?: string;
    specializationId?: number;
    biography: string;
    profile: UserProfile;
    specialization: string;
    availabilities: DoctorAvailabilities[],
    userId?: number;
}

export interface DoctorAvailabilities {
    day: string;
    startTime: string | Date;
    endTime: string;
}
