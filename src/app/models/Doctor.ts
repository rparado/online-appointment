import {UserProfile} from  '../models/User';

export interface Doctor {
    fee?: string;
    specializationId?: number;
    biography: string;
    profile: UserProfile;
    specialization: string;
    availabilities: DoctorAvailabilities[]
}

export interface DoctorAvailabilities {
    day: string;
    startTime: string | Date;
    endTime: string;
}
