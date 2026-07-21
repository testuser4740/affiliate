"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressLoader = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const bodyParser = tslib_1.__importStar(require("body-parser"));
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const path_1 = tslib_1.__importDefault(require("path"));
const authorizationChecker_1 = require("../auth/authorizationChecker");
const currentUserChecker_1 = require("../auth/currentUserChecker");
const env_1 = require("../env");
const swagger_schemas_1 = require("../api/swagger-schemas");
const expressLoader = async (settings) => {
    if (!settings) {
        return;
    }
    const connection = settings.getData('connection');
    const app = (0, express_1.default)();
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.join(__dirname, '../../views'));
    const expressApp = (0, routing_controllers_1.useExpressServer)(app, {
        cors: true,
        classTransformer: true,
        routePrefix: env_1.env.app.routePrefix,
        defaultErrorHandler: false,
        controllers: [path_1.default.join(__dirname, '../api/controllers/**')],
        middlewares: [path_1.default.join(__dirname, '../api/middlewares/**')],
        authorizationChecker: (0, authorizationChecker_1.authorizationChecker)(connection),
        currentUserChecker: (0, currentUserChecker_1.currentUserChecker)(connection),
    });
    expressApp.use(bodyParser.urlencoded({ extended: true }));
    expressApp.use(bodyParser.json({ limit: '5mb' }));
    // Dashboard (non-API page)
    expressApp.get('/dashboard', async (req, res) => {
        const { renderDashboard } = await Promise.resolve().then(() => tslib_1.__importStar(require('../api/web/dashboard')));
        await renderDashboard(req, res);
    });
    // Swagger UI
    const spec = (0, routing_controllers_openapi_1.routingControllersToSpec)(require('routing-controllers').getMetadataArgsStorage(), { routePrefix: env_1.env.app.routePrefix, controllers: [] }, { info: { title: 'Gajab Admin API', version: '1.0.0' }, components: { schemas: swagger_schemas_1.swaggerSchemas } });
    expressApp.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec));
    if (!env_1.env.isTest) {
        expressApp.listen(env_1.env.app.port, () => {
            // eslint-disable-next-line no-console
            console.log(`Gajab admin API listening on :${env_1.env.app.port}`);
            console.log(`Swagger UI → http://localhost:${env_1.env.app.port}/api/docs`);
        });
    }
    settings.setData('express_app', expressApp);
};
exports.expressLoader = expressLoader;
//# sourceMappingURL=expressLoader.js.map