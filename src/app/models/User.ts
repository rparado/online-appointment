export interface User {
    email: string;
    password: string;
}
export interface UserProfile {
    userId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: string | Date;
    age: number;
    phoneNumber: string;
    avatar: string;
    address: string;
    gender: string;
}

