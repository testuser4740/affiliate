import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { AffiliateUrl } from '../models/affiliate-urls';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class AffiliateUrlRepository {
    public repository: Repository<AffiliateUrl>;
    constructor() {
        this.repository = getConnection().getRepository(AffiliateUrl);
    }
}
