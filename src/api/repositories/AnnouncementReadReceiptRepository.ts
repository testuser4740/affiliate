import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { AnnouncementReadReceipt } from '../models/announcement-read-receipts';
import { getConnection } from '../../loaders/typeormLoader';

@Service()
export class AnnouncementReadReceiptRepository {
    public repository: Repository<AnnouncementReadReceipt>;

    constructor() {
        this.repository = getConnection().getRepository(AnnouncementReadReceipt);
    }

    async markRead(announcementId: string, ambassadorId: string): Promise<AnnouncementReadReceipt> {
        const existing = await this.repository.findOne({
            where: { announcementId, ambassadorId }
        });

        if (existing) {
            existing.readAt = new Date();
            return this.repository.save(existing);
        }

        const receipt = this.repository.create({
            id: `ARR-${Date.now()}`,
            announcementId,
            ambassadorId,
            readAt: new Date(),
        });

        return this.repository.save(receipt);
    }

    async findReceipt(announcementId: string, ambassadorId: string): Promise<AnnouncementReadReceipt | null> {
        return this.repository.findOne({
            where: { announcementId, ambassadorId }
        });
    }

    async getReadCount(announcementId: string): Promise<number> {
        return this.repository.count({
            where: { announcementId, readAt: { $ne: null } as any }
        });
    }

    async getUnreadForAmbassador(ambassadorId: string): Promise<AnnouncementReadReceipt[]> {
        return this.repository.find({
            where: { ambassadorId, readAt: { $eq: null } as any },
            relations: ["announcement"]
        });
    }
}