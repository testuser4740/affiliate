import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  IsDateString,
  Min,
  Max,
  IsBoolean,
  MinLength,
} from "class-validator";

// ---- Applicants ----
export class CreateApplicantInput {
  @IsString() name!: string;
  @IsString() phone!: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsString() email!: string;
  @IsString() college!: string;
  @IsString() city!: string;
  @IsString() state!: string;
  @IsOptional() @IsString() year?: string;
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() clubInvolvement?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) commissionPct?: number;
  @IsOptional() @IsString() appliedOn?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() comments?: string;
}

export class UpdateApplicantInput {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() college?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() year?: string;
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() clubInvolvement?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) commissionPct?: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() comments?: string;
}

export class ApplicantActionInput {
  @IsOptional() @IsString() comment?: string;
}

// Convert an approved applicant into an Ambassador + login User.
export class ConvertApplicantInput {
  @IsString() @MinLength(6) password!: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() college?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) commissionPct?: number;
}
