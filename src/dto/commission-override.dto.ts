import { IsString, IsOptional, IsInt, Min, Max, IsIn, IsDateString } from "class-validator";

export class CreateCommissionOverrideInput {
  @IsString() label!: string;
  @IsOptional() @IsString() appliesTo?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) overridePct?: number;
  @IsOptional() @IsInt() @Min(0) @Max(100) originalPct?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsIn(["Scheduled", "Active", "Expired"]) status?: string;
}

export class UpdateCommissionOverrideInput {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() appliesTo?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) overridePct?: number;
  @IsOptional() @IsInt() @Min(0) @Max(100) originalPct?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsString() status?: string;
}
