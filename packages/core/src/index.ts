import { RequiredKeys } from 'utility-types';

/**
 * Descibes a function which maps function parameters to http request config
 */
export type ApiMethodDeclaration<ParamsData, ResponseData, DisplayName = ''> = {
    (params: ParamsData): RequestConfig;
    displayName?: DisplayName;
};


export type RequestConfig = RequestInit;

export type ApiError = AxiosError;

type InitApiConfig<P> = {
    /**
     * Lazy initialization of config extenders
     */
    getConfigExtenders(extenders: ConfigExtendersCollection): ConfigExtendersCollection<P>;
    /**
     * Response handlers
     */
    resultHandlers?: Function[];
};

export function initApi<T, P>(
    apiDeclaration: ApiDeclaration<T>,
    { getConfigExtenders, resultHandlers }: InitApiConfig<P>,
) {
    const api = {} as Api<T, P>;

    let configExtender: RequestConfigExtender<P>;

    // Wrap with axios and apply config extenders
    Object.keys(apiDeclaration).forEach((key) => {
        api[key] = async (params, { ...transportConfig } = {} as TransportConfig) => {
            let axiosConfig: AxiosRequestConfig = apiDeclaration[key](params);

            axiosConfig = {
                ...axiosConfig,
                ...transportConfig,
            };

            if (!configExtender) {
                configExtender = getConfigExtenders(createConfigExtendersCollection());
            }

            axiosConfig = configExtender(axiosConfig, transportConfig as P);

            // TODO: request started handler

            try {
                let result = await fetch(axiosConfig);

                if (resultHandlers) {
                    resultHandlers.forEach((handler) => {
                        result = handler(result);
                    });
                }
                
                // TODO: response success handler

                return result;
            } catch (error) {
                let errorResult = error;

                if (resultHandlers) {
                    resultHandlers.forEach((handler) => {
                        errorResult = handler(errorResult);
                    });
                }

                // TODO: response error handler

                throw error;
            }
        };

        api[key].displayName = key;
    });

    return api;
}

/**
 * Api is a collection of Api methods
 */
export type ApiDeclaration<T> = {
    [P in keyof T]: T[P];
};

export type TransportConfig = {
    signal?: AbortSignal;
};

export type Api<T, AdditionalParams = {}> = {
    [P in keyof T]: MakeServiceFromServiceDeclaration<T[P], AdditionalParams, P>;
};

export type MakeServiceFromServiceDeclaration<T, AdditionalParams, DisplayName> =
    RequiredKeys<AdditionalParams> extends never
        ? {
              (
                  params: ExtractApiMethodParamsType<T>,
                  transportConfig?: TransportConfig & AdditionalParams,
              ): AxiosPromise<ExtractApiMethodResponseDataType<T>>;
              displayName: DisplayName;
          }
        : {
              (
                  params: ExtractApiMethodParamsType<T>,
                  transportConfig: TransportConfig & AdditionalParams,
              ): AxiosPromise<ExtractApiMethodResponseDataType<T>>;
              displayName: DisplayName;
          };

export type RequestConfigExtender<AdditionalParams> = {
    (config: RequestConfig, params?: AdditionalParams): RequestConfig;
};

export type ConfigExtendersCollection<T = {}> = RequestConfigExtender<T> & {
    add: <P>(e: RequestConfigExtender<P>) => ConfigExtendersCollection<T & P>;
};

export function createConfigExtendersCollection(): ConfigExtendersCollection {
    const configExtenders: Array<RequestConfigExtender<any>> = [];

    const func: RequestConfigExtender<any> = (axiosConfig, params) => {
        configExtenders.forEach((configExtender) => {
            axiosConfig = configExtender(axiosConfig, params);
        });

        return axiosConfig;
    };

    const result = func as ConfigExtendersCollection<any>;

    result.add = (configExtender) => {
        configExtenders.push(configExtender);

        return result;
    };

    return result;
}
