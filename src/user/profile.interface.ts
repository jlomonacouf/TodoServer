import internal from "stream";

export interface Profile {
    username: string;
    email: string;
    password: string;
    salt: string;
    first_name: string;
    last_name: string;
    date_created: number;
    isVerified: number;
}