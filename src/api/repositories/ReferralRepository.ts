import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { ReferralCode } from '../models/referral-codes';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class ReferralRepository {
    public repository: Repository<ReferralCode>;
    constructor() {
        this.repository = getConnection().getRepository(ReferralCode);
    }
}
