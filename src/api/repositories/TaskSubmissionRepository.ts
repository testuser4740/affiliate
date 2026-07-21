import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { TaskSubmission } from '../models/task-submissions';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class TaskSubmissionRepository {
    public repository: Repository<TaskSubmission>;
    constructor() {
        this.repository = getConnection().getRepository(TaskSubmission);
    }
}
