import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Service } from 'typedi';
import { Applicant } from '../models/applicants';
import { getConnection } from '../../loaders/typeormLoader';

export interface ApplicantFilter {
    q?: string;
    status?: string;
    state?: string;
    city?: string;
}

@Service()
export class ApplicantRepository {
    public repository: Repository<Applicant>;

    constructor() {
        this.repository = getConnection().getRepository(Applicant);
    }

    async search(filter: ApplicantFilter): Promise<Applicant[]> {
        const where: Record<string, unknown> = {};
        if (filter.status && filter.status !== 'All') where.status = filter.status;
        if (filter.state && filter.state !== 'All States') where.state = filter.state;
        if (filter.city && filter.city !== 'All Cities') where.city = filter.city;

        const all = await this.repository.find({ where, order: { appliedOn: 'DESC' } });
        if (!filter.q) return all;
        const needle = filter.q.toLowerCase();
        return all.filter((a) =>
            `${a.name}${a.college}${a.city}${a.email}${a.state}`.toLowerCase().includes(needle),
        );
    }

    async findByEmailOrPhone(email: string, phone: string): Promise<Applicant | null> {
        return this.repository.findOne({ where: [{ email }, { phone }] as FindOptionsWhere<Applicant>[] });
    }

    async findOrFail(id: string): Promise<Applicant> {
        const applicant = await this.repository.findOne({ where: { id } });
        if (!applicant) {
            const err = new Error(`Applicant ${id} not found`) as Error & { status?: number };
            err.status = 404;
            throw err;
        }
        return applicant;
    }

    async countByPrefix(prefix: string): Promise<number> {
        return this.repository.count({ where: { id: Like(`${prefix}%`) } });
    }
}
