export function getOsEnv(key: string): string {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key] as string;
}

export function getOsEnvOptional(key: string): string | undefined {
    return process.env[key];
}

export function toNumber(value: string | undefined): number {
    return parseInt(value || '0', 10);
}

export function toBool(value: string | undefined): boolean {
    return value === 'true';
}

export function normalizePort(port: string | number): number | string | boolean {
    const parsedPort = parseInt(port as string, 10);
    if (isNaN(parsedPort)) {
        return port;
    }
    if (parsedPort >= 0) {
        return parsedPort;
    }
    return false;
}
