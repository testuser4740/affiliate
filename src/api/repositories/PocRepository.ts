import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Poc } from '../models/pocs';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class PocRepository {
    public repository: Repository<Poc>;
    constructor() {
        this.repository = getConnection().getRepository(Poc);
    }
}
