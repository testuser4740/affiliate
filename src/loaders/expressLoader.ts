import { Application } from 'express';
import express from 'express';
import * as bodyParser from 'body-parser';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { authorizationChecker } from '../auth/authorizationChecker';
import { currentUserChecker } from '../auth/currentUserChecker';
import { env } from '../env';
import { swaggerSchemas } from '../api/swagger-schemas';
import { liveBus, connectionManager } from '../api/lib/eventBus';

export const expressLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (!settings) {
        return;
    }
    const connection = settings.getData('connection');

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../views'));

    const expressApp: Application = useExpressServer(app, {
        cors: true,
        classTransformer: true,
        routePrefix: env.app.routePrefix,
        defaultErrorHandler: false,
        controllers: [path.join(__dirname, '../api/controllers/**')],
        middlewares: [path.join(__dirname, '../api/middlewares/**')],
        authorizationChecker: authorizationChecker(connection),
        currentUserChecker: currentUserChecker(connection),
    });

    expressApp.use(bodyParser.urlencoded({ extended: true }));
    expressApp.use(bodyParser.json({ limit: '5mb' }));

    // Dashboard (non-API page)
    expressApp.get('/dashboard', async (req, res) => {
        const { renderDashboard } = await import('../api/web/dashboard');
        await renderDashboard(req, res);
    });

    // Live data stream (Server-Sent Events).
    // A single long-lived connection per client; stays open until disconnect/logout
    // and pushes real-time DB changes (leaderboard, orders, onboarding, inbox).
    expressApp.get('/api/stream', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders?.();

        const send = (event: string, data: unknown) => {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            if (typeof (res as any).flush === 'function') (res as any).flush();
        };

        send('connected', { ok: true });

        const ambassadorId = (req as any).query?.ambassadorId as string | undefined;
        const remove = connectionManager.add({
            ambassadorId,
            listener: (event: unknown) => send((event as any).type, event),
        });

        const onLive = (event: unknown) => {
            const typed = event as any;
            if (typed?.type === 'inbox') {
                if (typed.ambassadorId && typed.ambassadorId !== ambassadorId) return;
            }
            send(typed?.type, event);
        };
        liveBus.on('live', onLive);

        const ping = setInterval(() => send('ping', {}), 25_000);

        const cleanup = () => {
            clearInterval(ping);
            liveBus.off('live', onLive);
            remove();
        };
        res.on('close', cleanup);
        res.on('finish', cleanup);
        res.on('error', cleanup);
    });

    // Swagger UI
    const spec = routingControllersToSpec(
        require('routing-controllers').getMetadataArgsStorage(),
        { routePrefix: env.app.routePrefix, controllers: [path.join(__dirname, '../api/controllers/**')] },
        { info: { title: 'Gajab Admin API', version: '1.0.0' }, components: { schemas: swaggerSchemas } },
    );
    expressApp.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));

    expressApp.get('/api/docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(spec);
    });

    if (!env.isTest) {
        expressApp.listen(env.app.port, () => {
            // eslint-disable-next-line no-console
            console.log(`Gajab admin API listening on :${env.app.port}`);
            console.log(`Swagger UI → http://localhost:${env.app.port}/api/docs`);
        });
    }

    settings.setData('express_app', expressApp);
};
