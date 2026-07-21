import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { ActivityLog } from '../models/activity-logs';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class ActivityRepository {
    public repository: Repository<ActivityLog>;
    constructor() {
        this.repository = getConnection().getRepository(ActivityLog);
    }
}
