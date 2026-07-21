import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { ActivityLog } from "../models/activity-logs";
import { ActivityRepository } from "../repositories/ActivityRepository";

@Service()
export class ActivityService {
  constructor(
    private repository: ActivityRepository,
    @Logger(__filename) private logger: LoggerInterface,
  ) {}

  async recent(limit = 50): Promise<ActivityLog[]> {
    return this.repository.repository.find({ order: { date: "DESC" }, take: limit });
  }

  async log(entry: Partial<ActivityLog>): Promise<ActivityLog> {
    const record = this.repository.repository.create(entry as Partial<ActivityLog>);
    return this.repository.repository.save(record);
  }
}
