import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { OrderUtilizationLog } from '../models/order-utilization-logs';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class OrderUtilizationRepository {
    public repository: Repository<OrderUtilizationLog>;
    constructor() {
        this.repository = getConnection().getRepository(OrderUtilizationLog);
    }
}
