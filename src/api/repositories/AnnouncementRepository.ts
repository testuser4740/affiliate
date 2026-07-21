import { Repository, Like } from 'typeorm';
import { Service } from 'typedi';
import { Announcement } from '../models/announcements';
import { getConnection } from '../../loaders/typeormLoader';

export interface AnnouncementFilter {
    audience?: string;
    priority?: string;
    tier?: string;
    city?: string;
    state?: string;
}

@Service()
export class AnnouncementRepository {
    public repository: Repository<Announcement>;

    constructor() {
        this.repository = getConnection().getRepository(Announcement);
    }

    async search(filter: AnnouncementFilter): Promise<Announcement[]> {
        const where: Record<string, unknown> = {};
        if (filter.audience) where.audience = filter.audience;
        if (filter.priority) where.priority = filter.priority;
        if (filter.tier) where.tier = filter.tier;
        if (filter.city) where.city = filter.city;
        if (filter.state) where.state = filter.state;
        return this.repository.find({ where, order: { sentOn: 'DESC' } });
    }

    async findOrFail(id: string): Promise<Announcement> {
        const item = await this.repository.findOne({ where: { id } });
        if (!item) {
            const err = new Error(`Announcement ${id} not found`) as Error & { status?: number };
            err.status = 404;
            throw err;
        }
        return item;
    }

    async countByPrefix(prefix: string): Promise<number> {
        return this.repository.count({ where: { id: Like(`${prefix}%`) } });
    }
}
