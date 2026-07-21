import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Tier } from '../models/tiers';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class TierRepository {
    public repository: Repository<Tier>;
    constructor() {
        this.repository = getConnection().getRepository(Tier);
    }
}
