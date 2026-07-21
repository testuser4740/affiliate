"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeormLoader_1 = require("../loaders/typeormLoader");
async function sync() {
    const dataSource = (0, typeormLoader_1.createDataSource)();
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
//# sourceMappingURL=sync.js.map