import { IsString, IsOptional, IsInt, Min, Max, IsIn, IsDateString } from "class-validator";

export class CreateAffiliateUrlInput {
  @IsString() url!: string;
  @IsOptional() @IsString() ambassador?: string;
  @IsOptional() @IsString() college?: string;
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() campaign?: string;
  @IsOptional() @IsString() channel?: string;
}

export class UpdateAffiliateUrlInput {
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() ambassador?: string;
  @IsOptional() @IsString() college?: string;
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() campaign?: string;
  @IsOptional() @IsString() channel?: string;
}
