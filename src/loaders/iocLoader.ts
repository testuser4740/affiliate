import { MicroframeworkLoader } from 'microframework-w3tec';
import { useContainer as classValidatorUseContainer } from 'class-validator';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { getConnection } from './typeormLoader';

export { getConnection };

export const iocLoader: MicroframeworkLoader = () => {
    routingUseContainer(Container);
    classValidatorUseContainer(Container, {
        fallback: true,
        fallbackOnErrors: true,
    });
};
