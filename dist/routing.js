"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routingControllersOptions = void 0;
const container_1 = require("./container");
const applicants_1 = require("./controllers/admin/applicants");
const announcements_1 = require("./controllers/admin/announcements");
const affiliate_urls_1 = require("./controllers/admin/affiliate-urls");
const commission_overrides_1 = require("./controllers/admin/commission-overrides");
const tasks_1 = require("./controllers/admin/tasks");
const pocs_1 = require("./controllers/admin/pocs");
const directory_1 = require("./controllers/admin/directory");
const analytics_1 = require("./controllers/admin/analytics");
const apply_1 = require("./controllers/apply");
const home_1 = require("./controllers/ambassador/home");
const inbox_1 = require("./controllers/ambassador/inbox");
const tier_1 = require("./controllers/ambassador/tier");
const tasks_2 = require("./controllers/ambassador/tasks");
const payouts_1 = require("./controllers/ambassador/payouts");
const announcements_2 = require("./controllers/ambassador/announcements");
const leaderboard_1 = require("./controllers/ambassador/leaderboard");
exports.routingControllersOptions = {
    routePrefix: "/api",
    controllers: [
        applicants_1.ApplicantController,
        announcements_1.AnnouncementController,
        affiliate_urls_1.AffiliateUrlController,
        commission_overrides_1.CommissionOverrideController,
        tasks_1.TaskController,
        pocs_1.PocController,
        directory_1.AmbassadorController,
        analytics_1.AnalyticsController,
        apply_1.ApplyController,
        home_1.AmbassadorHomeController,
        inbox_1.AmbassadorInboxController,
        tier_1.AmbassadorTierController,
        tasks_2.AmbassadorTaskController,
        payouts_1.AmbassadorPayoutController,
        announcements_2.AmbassadorAnnouncementController,
        leaderboard_1.AmbassadorLeaderboardController,
    ],
    authorizationChecker: container_1.authorizationChecker,
    currentUserChecker: container_1.currentUserChecker,
    defaultErrorHandler: false,
};
//# sourceMappingURL=routing.js.map