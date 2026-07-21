import { IsString, IsOptional, IsIn, IsBoolean } from "class-validator";

export class CreateAnnouncementInput {
  @IsString() title!: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional()
  @IsIn(["All Ambassadors", "Gold + Platinum tiers", "Silver tier", "Bronze tier", "Specific city", "Specific state"])
  audience?: string;
  @IsOptional() @IsIn(["High", "Medium", "Low"]) priority?: string;
  @IsOptional() @IsString() tier?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
}

export class UpdateAnnouncementInput {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsString() audience?: string;
  @IsOptional() @IsIn(["High", "Medium", "Low"]) priority?: string;
  @IsOptional() @IsString() tier?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsBoolean() sendToAmbassadors?: boolean;
}
