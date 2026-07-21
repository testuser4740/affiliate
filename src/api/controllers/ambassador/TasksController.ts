import {
  JsonController,
  Get,
  Post,
  Param,
  QueryParam,
  Body,
  Authorized
} from "routing-controllers";
import { Service } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Task } from "../../models/tasks";
import { TaskSubmission } from "../../models/task-submissions";
import { TaskService } from "../../services/task.service";
import { AmbassadorService } from "../../services/ambassador.service";
import { ApiList } from "../../types";

@Service()
@Authorized("ambassador")
@JsonController("/ambassador")
export class AmbassadorTaskController {
  constructor(
    private taskService: TaskService,
    private ambassadorService: AmbassadorService,
  ) {}

  @Get("/:ambassadorId/tasks")
  @ResponseSchema(Task, { isArray: true })
  async tasks(
    @Param("ambassadorId") _ambassadorId: string,
    @QueryParam("status") status?: string,
  ): Promise<Task[]> {
    const { data } = await this.taskService.list({ status });
    return data;
  }

  @Get("/:ambassadorId/tasks/submissions")
  @ResponseSchema(TaskSubmission, { isArray: true })
  async mySubmissions(@Param("ambassadorId") ambassadorId: string): Promise<TaskSubmission[]> {
    const { data } = await this.taskService.submissions();
    return data.filter((s) => s.ambassadorId === ambassadorId);
  }

  @Post("/:ambassadorId/tasks/:taskId/submit")
  @ResponseSchema(TaskSubmission)
  async submitTask(
    @Param("ambassadorId") ambassadorId: string,
    @Param("taskId") taskId: string,
    @Body() body: { proof?: string; college?: string },
  ): Promise<TaskSubmission> {
    await this.ambassadorService.getById(ambassadorId);
    const task = await this.taskService.getById(taskId);

    const { data: allSubs } = await this.taskService.submissions();
    const existing = allSubs.find(
      (s) => s.ambassadorId === ambassadorId && s.task === task.title && s.status === "Pending Review",
    );

    if (existing) {
      existing.proof = body.proof ?? existing.proof;
      return this.taskService.updateSubmission(existing);
    }

    return this.taskService.assign(taskId, {
      ambassador: ambassadorId,
      college: body.college,
    });
  }
}
