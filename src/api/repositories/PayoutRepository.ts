import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Payout } from '../models/payouts';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class PayoutRepository {
    public repository: Repository<Payout>;
    constructor() {
        this.repository = getConnection().getRepository(Payout);
    }
}
