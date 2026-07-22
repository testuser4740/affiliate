import { Service } from "typedi";
import { Like } from "typeorm";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Task } from "../models/tasks";
import { TaskSubmission } from "../models/task-submissions";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskSubmissionRepository } from "../repositories/TaskSubmissionRepository";
import { NotFoundError } from "../errors";
import {
  CreateTaskInput,
  UpdateTaskInput,
  AssignTaskInput,
  ReviewSubmissionInput,
} from "../../dto/task.dto";
import { liveBus } from "../lib/eventBus";

export interface TaskFilter {
  status?: string;
  q?: string;
}

@Service()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private submissionRepository: TaskSubmissionRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  private repo() {
    return this.taskRepository.repository;
  }

  private subRepo() {
    return this.submissionRepository.repository;
  }

  async list(filter: TaskFilter): Promise<{ data: Task[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (filter.status && filter.status !== "All") where.status = filter.status;
    const all = await this.repo().find({ where, order: { deadline: "ASC" } });
    const data = filter.q
      ? all.filter((t) => `${t.id}${t.title}${t.description}`.toLowerCase().includes(filter.q!.toLowerCase()))
      : all;
    return { data, total: data.length };
  }

  async getById(id: string): Promise<Task> {
    const task = await this.repo().findOne({ where: { id } });
    if (!task) throw new NotFoundError(`Task ${id} not found`);
    return task;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    if (!input.title?.trim()) throw new NotFoundError("Title is required");
    const repo = this.repo();
    const count = await repo.count({ where: { id: Like(`T-%`) } });
    const sequence = (count + 1).toString().padStart(3, "0");
    const task = repo.create({
      id: `T-${sequence}`,
      title: input.title,
      description: input.description,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      reward: input.reward ?? 0,
      status: input.status ?? "Active",
    } as Partial<Task>);
    const saved = await repo.save(task);
    liveBus.broadcast({ type: "tasks" });
    return saved;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const repo = this.repo();
    const task = await this.getById(id);
    repo.merge(task, input);
    const saved = await repo.save(task);
    liveBus.broadcast({ type: "tasks" });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const repo = this.repo();
    const task = await this.getById(id);
    await repo.remove(task);
    liveBus.broadcast({ type: "tasks" });
  }

  async assign(id: string, input: AssignTaskInput): Promise<TaskSubmission> {
    const task = await this.getById(id);
    const submission = this.subRepo().create({
      submissionId: `TS-${Date.now()}`,
      ambassadorId: input.ambassador,
      taskId: task.id,
      college: input.college,
      task: task.title,
      status: "Pending Review",
    } as Partial<TaskSubmission>);
    const saved = await this.subRepo().save(submission);

    task.assignedCount = (task.assignedCount ?? 0) + 1;
    await this.repo().save(task);
    liveBus.broadcast({ type: "tasks" });
    return saved;
  }

  async review(submissionId: string, input: ReviewSubmissionInput): Promise<TaskSubmission> {
    const repo = this.subRepo();
    const submission = await repo.findOne({ where: { submissionId } });
    if (!submission) throw new NotFoundError(`Submission ${submissionId} not found`);
    submission.status = input.status;
    if (input.rejectReason) submission.rejectReason = input.rejectReason;
    const saved = await repo.save(submission);

    if (input.status === "Approved") {
      const task = await this.repo().findOne({ where: { title: submission.task } });
      if (task) {
        task.completedCount = (task.completedCount ?? 0) + 1;
        await this.repo().save(task);
      }
    }
    liveBus.broadcast({ type: "tasks" });
    return saved;
  }

  async assignedTasks(ambassadorId: string): Promise<any[]> {
    const subs = await this.subRepo().find({
      where: { ambassadorId },
      order: { createdAt: "DESC" },
    });
    const result: any[] = [];
    for (const sub of subs) {
      const task = sub.taskId ? await this.repo().findOne({ where: { id: sub.taskId } }) : null;
      result.push({
        id: sub.taskId ?? sub.submissionId,
        submissionId: sub.submissionId,
        title: task?.title ?? sub.task,
        description: task?.description ?? "",
        deadline: task?.deadline ?? null,
        reward: task?.reward ?? 0,
        status: sub.status,
        rejectReason: sub.rejectReason,
        submission: sub.proof,
        submittedOn: sub.submittedOn,
      });
    }
    return result;
  }

  async submissions(status?: string): Promise<{ data: TaskSubmission[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    const data = await this.subRepo().find({ where, order: { createdAt: "DESC" } });
    return { data, total: data.length };
  }

  async updateSubmission(submission: TaskSubmission): Promise<TaskSubmission> {
    submission.submittedOn = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    const saved = await this.subRepo().save(submission);
    liveBus.broadcast({ type: "tasks" });
    return saved;
  }
}
