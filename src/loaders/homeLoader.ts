import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

export const homeLoader: MicroframeworkLoader = async (_settings: MicroframeworkSettings | undefined) => {
    // Intentionally minimal: the dashboard + swagger are wired in expressLoader.
};

export const publicLoader: MicroframeworkLoader = async (_settings: MicroframeworkSettings | undefined) => {
    // Static/public asset serving can be added here if needed.
};
