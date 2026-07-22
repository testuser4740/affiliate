import {
  JsonController,
  Get,
  Post,
  Param,
  QueryParam,
  Body,
  Authorized,
  BadRequestError,
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

  /**
   * @openapi
   * /ambassador/{ambassadorId}/tasks:
   *   get:
   *     tags: [Ambassador / Tasks]
   *     summary: Assigned tasks for the ambassador
   */
  @Get("/:ambassadorId/tasks")
  @ResponseSchema(Task, { isArray: true })
  async tasks(
    @Param("ambassadorId") ambassadorId: string,
    @QueryParam("status") status?: string,
  ): Promise<any[]> {
    const all = await this.taskService.assignedTasks(ambassadorId);
    if (status) return all.filter((t) => t.status === status);
    return all;
  }

  /**
   * @openapi
   * /ambassador/{ambassadorId}/tasks/submissions:
   *   get:
   *     tags: [Ambassador / Tasks]
   *     summary: My task submissions
   */
  @Get("/:ambassadorId/tasks/submissions")
  @ResponseSchema(TaskSubmission, { isArray: true })
  async mySubmissions(@Param("ambassadorId") ambassadorId: string): Promise<TaskSubmission[]> {
    const { data } = await this.taskService.submissions();
    return data.filter((s) => s.ambassadorId === ambassadorId);
  }

  /**
   * @openapi
   * /ambassador/{ambassadorId}/tasks/{taskId}/submit:
   *   post:
   *     tags: [Ambassador / Tasks]
   *     summary: Submit task proof
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               proof: { type: string }
   *               college: { type: string }
   *       }
   */
  @Post("/:ambassadorId/tasks/:taskId/submit")
  @ResponseSchema(TaskSubmission)
  async submitTask(
    @Param("ambassadorId") ambassadorId: string,
    @Param("taskId") taskId: string,
    @Body() body: { proof?: string; college?: string },
  ): Promise<TaskSubmission> {
    console.log(`[submitTask] ambassadorId=${ambassadorId} taskId=${taskId} proof=${body?.proof?.slice(0,50)}`);
    try {
      await this.ambassadorService.getById(ambassadorId);
      const task = await this.taskService.getById(taskId);
      console.log(`[submitTask] task found: title="${task.title}"`);

      const { data: allSubs } = await this.taskService.submissions();
      const existing = allSubs.find(
        (s) => s.ambassadorId === ambassadorId && s.task === task.title,
      );

      if (existing) {
        console.log(`[submitTask] found existing submission ${existing.submissionId}, status=${existing.status}`);

        if (existing.status === "Under Review")
          throw new BadRequestError("Submission already under review");
        if (existing.status === "Approved")
          throw new BadRequestError("Task already approved");
        if (existing.status === "Resubmitted")
          throw new BadRequestError("Resubmission already pending review");
        if (existing.status !== "Rejected" && existing.status !== "Pending Review")
          throw new BadRequestError("Cannot submit at this stage");

        existing.proof = body.proof ?? existing.proof;
        existing.status = existing.status === "Rejected" ? "Resubmitted" : "Under Review";
        return this.taskService.updateSubmission(existing);
      }

      console.log(`[submitTask] no existing submission — creating new one via assign()`);
      return this.taskService.assign(taskId, {
        ambassador: ambassadorId,
        college: body.college,
      });
    } catch (err: any) {
      console.error(`[submitTask] ERROR:`, err?.message ?? err);
      throw err;
    }
  }
}
