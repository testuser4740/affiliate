export interface CreatePocInput {
    name: string;
    role: string;
    region?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    avatar?: string;
    workingHours?: string;
}

export interface UpdatePocInput {
    name?: string;
    role?: string;
    region?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    avatar?: string;
    workingHours?: string;
}
