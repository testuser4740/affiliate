import { IsOptional, IsString, IsInt, Min, Max, IsIn } from "class-validator";

export class CreateAmbassadorInput {
  @IsString() name!: string;
  @IsString() college!: string;
  @IsString() city!: string;
  @IsString() state!: string;
  @IsString() email!: string;
  @IsString() phone!: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsInt() @Min(0) commissionPct?: number;
  @IsOptional() @IsIn(["Bronze", "Silver", "Gold", "Platinum"]) tier?: string;
}

export class UpdateAmbassadorInput {
  @IsOptional() @IsString() college?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsString() tier?: string;
  @IsOptional() @IsInt() @Min(0) commissionPct?: number;
}
