import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { InboxMessage } from '../models/inbox-messages';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class InboxRepository {
    public repository: Repository<InboxMessage>;
    constructor() {
        this.repository = getConnection().getRepository(InboxMessage);
    }
}
