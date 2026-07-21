"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const applicants_1 = require("./entities/applicants");
const ambassadors_1 = require("./entities/ambassadors");
const tiers_1 = require("./entities/tiers");
const affiliate_urls_1 = require("./entities/affiliate-urls");
const commission_overrides_1 = require("./entities/commission-overrides");
const order_utilization_logs_1 = require("./entities/order-utilization-logs");
const referral_codes_1 = require("./entities/referral-codes");
const commission_history_1 = require("./entities/commission-history");
const activity_logs_1 = require("./entities/activity-logs");
const tasks_1 = require("./entities/tasks");
const task_submissions_1 = require("./entities/task-submissions");
const payouts_1 = require("./entities/payouts");
const announcements_1 = require("./entities/announcements");
const inbox_messages_1 = require("./entities/inbox-messages");
const pocs_1 = require("./entities/pocs");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database: process.env.DB_NAME ?? "gajab_affiliate",
    synchronize: true,
    logging: false,
    entities: [
        applicants_1.Applicant,
        ambassadors_1.Ambassador,
        tiers_1.Tier,
        affiliate_urls_1.AffiliateUrl,
        commission_overrides_1.CommissionOverride,
        order_utilization_logs_1.OrderUtilizationLog,
        referral_codes_1.ReferralCode,
        commission_history_1.CommissionHistory,
        activity_logs_1.ActivityLog,
        tasks_1.Task,
        task_submissions_1.TaskSubmission,
        payouts_1.Payout,
        announcements_1.Announcement,
        pocs_1.Poc,
        inbox_messages_1.InboxMessage,
    ],
    migrations: ["src/migrations/*.ts"],
    // InitialSchema keeps synchronize in dev while allowing migration:generate in prod.
    migrationsRun: false,
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map