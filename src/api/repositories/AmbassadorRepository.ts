import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Ambassador } from '../models/ambassadors';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class AmbassadorRepository {
    public repository: Repository<Ambassador>;
    constructor() {
        this.repository = getConnection().getRepository(Ambassador);
    }
}
