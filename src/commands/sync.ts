import 'reflect-metadata';
import { createDataSource } from '../loaders/typeormLoader';

async function sync(): Promise<void> {
    const dataSource = createDataSource();
    await dataSource.initialize();
    // eslint-disable-next-line no-console
    console.log('Database connected. Synchronizing schema...');
    await dataSource.synchronize();
    // eslint-disable-next-line no-console
    console.log('Schema synchronized.');
    await dataSource.destroy();
}

sync().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Schema sync failed:', err);
    process.exit(1);
});
