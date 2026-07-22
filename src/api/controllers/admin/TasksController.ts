import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  QueryParam,
  Body,
  OnUndefined,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Task } from "../../models/tasks";
import { TaskSubmission } from "../../models/task-submissions";
import { TaskService } from "../../services/task.service";
import { ApiList } from "../../types";
import {
  CreateTaskInput,
  UpdateTaskInput,
  AssignTaskInput,
  ReviewSubmissionInput,
} from "../../../dto/task.dto";

@Service()
@Authorized("admin")
@JsonController("/admin/tasks")
export class TaskController {
  @Inject()
  private service!: TaskService;

  /**
   * @openapi
   * /admin/tasks:
   *   get:
   *     tags: [Admin / Tasks]
   *     summary: List tasks
   */
  @Get("/")
  @ResponseSchema(Task, { isArray: true })
  async list(@QueryParam("status") status?: string, @QueryParam("q") q?: string): Promise<ApiList<Task>> {
    return this.service.list({ status, q });
  }

  /**
   * @openapi
   * /admin/tasks/submissions:
   *   get:
   *     tags: [Admin / Tasks]
   *     summary: List task submissions
   */
  @Get("/submissions")
  @ResponseSchema(TaskSubmission, { isArray: true })
  async submissions(@QueryParam("status") status?: string): Promise<ApiList<TaskSubmission>> {
    return this.service.submissions(status);
  }

  @Get("/:id")
  @ResponseSchema(Task)
  async get(@Param("id") id: string): Promise<Task> {
    return this.service.getById(id);
  }

  /**
   * @openapi
   * /admin/tasks:
   *   post:
   *     tags: [Admin / Tasks]
   *     summary: Create a task
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskInput'
   *       }
   */
  @Post("/")
  @ResponseSchema(Task)
  async create(@Body() body: CreateTaskInput): Promise<Task> {
    return this.service.create(body);
  }

  /**
   * @openapi
   * /admin/tasks/submissions/{submissionId}/review:
   *   post:
   *     tags: [Admin / Tasks]
   *     summary: Review a submission (approve/reject/resubmit)
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReviewSubmissionInput'
   *       }
   */
  @Post("/submissions/:submissionId/review")
  @ResponseSchema(TaskSubmission)
  async review(@Param("submissionId") submissionId: string, @Body() body: ReviewSubmissionInput): Promise<TaskSubmission> {
    return this.service.review(submissionId, body);
  }

  @Post("/:id/assign")
  @ResponseSchema(TaskSubmission)
  async assign(@Param("id") id: string, @Body() body: AssignTaskInput): Promise<TaskSubmission> {
    return this.service.assign(id, body);
  }

  /**
   * @openapi
   * /admin/tasks/{id}:
   *   put:
   *     tags: [Admin / Tasks]
   *     summary: Update a task
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskInput'
   *       }
   */
  @Put("/:id")
  @ResponseSchema(Task)
  async update(@Param("id") id: string, @Body() body: UpdateTaskInput): Promise<Task> {
    return this.service.update(id, body);
  }

  @Delete("/:id")
  @OnUndefined(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.service.remove(id);
  }
}
