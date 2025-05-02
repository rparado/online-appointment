import {UserProfile} from  '../models/User';

export interface Doctor {
    fee?: string;
    specializationId?: number;
    biography: string;
    profile: UserProfile;
    specialization: string;
    avalabilities: DoctorAvailabilities[]
}

export interface DoctorAvailabilities {
    name: string;
    startTime: string | Date;
    endTime: string;
}
