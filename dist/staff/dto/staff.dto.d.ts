export declare const PASSWORD_POLICY: RegExp;
export declare class CreateStaffDto {
    name: string;
    photo_url?: string;
    empl_no: string;
    id_no: string;
    role: string;
    designation?: string;
    phone_number?: string;
    password: string;
    department?: string;
    department_id?: number;
    station_id?: number;
    business_email?: string;
    department_email?: string;
    salary?: number;
    employment_type: string;
    gender: 'Male' | 'Female' | 'Other';
    is_active?: number;
    avatar_url?: string;
    status?: number;
}
declare const UpdateStaffDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateStaffDto>>;
export declare class UpdateStaffDto extends UpdateStaffDto_base {
}
export {};
