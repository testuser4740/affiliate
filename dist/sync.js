"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
async function sync() {
    await data_source_1.AppDataSource.initialize();
    console.log("Database connected. Synchronizing schema...");
    await data_source_1.AppDataSource.synchronize();
    console.log("Schema synchronized.");
    await data_source_1.AppDataSource.destroy();
}
sync().catch((err) => {
    console.error("Schema sync failed:", err);
    process.exit(1);
});
//# sourceMappingURL=sync.js.map