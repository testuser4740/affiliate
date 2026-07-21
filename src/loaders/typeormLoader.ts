import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '../env';
import path from 'path';

const dataSourceInstances: Map<string, DataSource> = new Map();
const CONNECTION_NAME = 'default';

export function createDataSource(): DataSource {
    const dbConfig: DataSourceOptions = {
        name: CONNECTION_NAME,
        type: env.db.type as any,
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        synchronize: env.db.synchronize,
        logging: env.db.logging,
        entities: [path.join(__dirname, '../api/models/**')],
        migrations: [path.join(__dirname, '../api/migrations/**')],
    };
    return new DataSource(dbConfig);
}

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    const dataSource = createDataSource();
    await dataSource.initialize();
    dataSourceInstances.set(CONNECTION_NAME, dataSource);

    if (settings) {
        settings.setData('connection', dataSource);
        settings.onShutdown(async () => {
            dataSourceInstances.forEach(async (ds) => {
                await ds.destroy();
            });
        });
    }
};

export const getConnection = (name: string = CONNECTION_NAME): DataSource => {
    const dataSource = dataSourceInstances.get(name);
    if (!dataSource) {
        throw new Error(`DataSource '${name}' not initialized. Ensure typeormLoader has run.`);
    }
    return dataSource;
};
