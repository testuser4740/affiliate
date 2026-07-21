"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.typeormLoader = void 0;
exports.createDataSource = createDataSource;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const env_1 = require("../env");
const path_1 = tslib_1.__importDefault(require("path"));
const dataSourceInstances = new Map();
const CONNECTION_NAME = 'default';
function createDataSource() {
    const dbConfig = {
        name: CONNECTION_NAME,
        type: env_1.env.db.type,
        host: env_1.env.db.host,
        port: env_1.env.db.port,
        username: env_1.env.db.username,
        password: env_1.env.db.password,
        database: env_1.env.db.database,
        synchronize: env_1.env.db.synchronize,
        logging: env_1.env.db.logging,
        entities: [path_1.default.join(__dirname, '../api/models/**')],
        migrations: [path_1.default.join(__dirname, '../api/migrations/**')],
    };
    return new typeorm_1.DataSource(dbConfig);
}
const typeormLoader = async (settings) => {
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
exports.typeormLoader = typeormLoader;
const getConnection = (name = CONNECTION_NAME) => {
    const dataSource = dataSourceInstances.get(name);
    if (!dataSource) {
        throw new Error(`DataSource '${name}' not initialized. Ensure typeormLoader has run.`);
    }
    return dataSource;
};
exports.getConnection = getConnection;
//# sourceMappingURL=typeormLoader.js.map