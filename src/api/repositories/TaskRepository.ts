import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Task } from '../models/tasks';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class TaskRepository {
    public repository: Repository<Task>;
    constructor() {
        this.repository = getConnection().getRepository(Task);
    }
}
