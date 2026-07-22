import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';
import { Logger } from '../lib/logger';
import { CommissionService } from '../api/services/commission.service';

export const commissionSyncLoader: MicroframeworkLoader = async (_settings: MicroframeworkSettings | undefined) => {
    const logger = new Logger(__filename);
    const commissionService = Container.get(CommissionService);

    try {
        await commissionService.syncOverrideStatuses();
        logger.info('Commission override statuses synced on startup');
    } catch (error) {
        logger.error('Failed to sync commission override statuses on startup: ' + error);
    }
};