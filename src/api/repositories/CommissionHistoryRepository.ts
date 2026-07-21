import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { CommissionHistory } from '../models/commission-history';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class CommissionHistoryRepository {
    public repository: Repository<CommissionHistory>;
    constructor() {
        this.repository = getConnection().getRepository(CommissionHistory);
    }
}
