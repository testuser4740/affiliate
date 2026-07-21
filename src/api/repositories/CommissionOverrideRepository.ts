import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { CommissionOverride } from '../models/commission-overrides';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class CommissionOverrideRepository {
    public repository: Repository<CommissionOverride>;
    constructor() {
        this.repository = getConnection().getRepository(CommissionOverride);
    }
}