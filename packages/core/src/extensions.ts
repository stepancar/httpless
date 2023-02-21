import { RequestConfigExtender } from './';

export function baseUrl(baseURL: string) {
    const configExtender: RequestConfigExtender<{}> = (config) => ({
        ...config,
        baseURL,
    });

    return configExtender;
}
