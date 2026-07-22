import { IsString, IsOptional, IsIn } from "class-validator";

export class CreatePocInput {
  @IsString() name!: string;
  @IsString() role!: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsString() workingHours?: string;
}

export class UpdatePocInput {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsString() workingHours?: string;
}

export class UpdatePocAmbassadorsInput {
  linkedAffiliates!: string[];
}
