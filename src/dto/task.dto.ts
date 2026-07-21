import { IsString, IsOptional, IsInt, Min, IsIn, IsDateString } from "class-validator";

export class CreateTaskInput {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() deadline?: string;
  @IsOptional() @IsInt() @Min(0) reward?: number;
  @IsOptional() @IsIn(["Active", "Closed"]) status?: string;
}

export class UpdateTaskInput {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() deadline?: string;
  @IsOptional() @IsInt() @Min(0) reward?: number;
  @IsOptional() @IsString() status?: string;
}

export class AssignTaskInput {
  @IsString() ambassador!: string;
  @IsOptional() @IsString() college?: string;
}

export class ReviewSubmissionInput {
  @IsIn(["Pending Review", "Approved", "Rejected", "Under Review", "Resubmitted"])
  status!: string;
  @IsOptional() @IsString() rejectReason?: string;
}
