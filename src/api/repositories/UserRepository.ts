import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { User } from '../models/users';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class UserRepository {
    public repository: Repository<User>;

    constructor() {
        this.repository = getConnection().getRepository(User);
    }
}
