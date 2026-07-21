"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.isProduction = exports.config = void 0;
function int(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && value !== undefined && value !== "" ? n : fallback;
}
exports.config = {
    env: process.env.NODE_ENV ?? "development",
    port: int(process.env.PORT, 4000),
    db: {
        host: process.env.DB_HOST ?? "localhost",
        port: int(process.env.DB_PORT, 5432),
        username: process.env.DB_USERNAME ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
        name: process.env.DB_NAME ?? "gajab_affiliate",
    },
};
const isProduction = () => exports.config.env === "production";
exports.isProduction = isProduction;
const isDevelopment = () => exports.config.env !== "production";
exports.isDevelopment = isDevelopment;
//# sourceMappingURL=index.js.map