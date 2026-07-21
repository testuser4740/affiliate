import { Container } from 'typedi';
import { Logger as WinstonLogger } from '../lib/logger';

type Constructable<T = any> = new (...args: any[]) => T;

export function Logger(scope: string): ParameterDecorator {
    return (target: any, propertyKey: string | symbol | undefined, index: number): void => {
        const logger = new WinstonLogger(scope);
        const propertyName = propertyKey ? propertyKey.toString() : '';
        Container.registerHandler({
            object: target as Constructable,
            propertyName,
            index,
            value: () => logger,
        });
    };
}

export { LoggerInterface } from '../lib/logger';
