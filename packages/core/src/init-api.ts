type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Descibes a function which maps function parameters to http request config
 */
export type ApiMethodDeclaration<ParamsData, ResponseData, ErrorData = {}, DisplayName = ''> = {
    (params: ParamsData): RequestConfig;
    displayName?: DisplayName;
};


export type RequestConfig = RequestInit & {
    url: string;
    params?: Record<string, any>;
    paramsSerializer?: (params: Record<string, any>) => string;
    baseURL?: string;
};

type InitApiConfig<P> = {
    /**
     * Lazy initialization of config extenders
     */
    getConfigExtenders?(extenders: ConfigExtendersCollection): ConfigExtendersCollection<P>;
    /**
     * Success response handlers
     */
    successResponseHandlers?: Function[];
    errorResponseHandlers?: Function[];
};

export function initApi<T, P>(
    apiDeclaration: ApiDeclaration<T>,
    {
        getConfigExtenders,
        successResponseHandlers,
        errorResponseHandlers,
    }: InitApiConfig<P>,
) {
    const api = {} as Api<T, P>;

    let configExtender: RequestConfigExtender<P>;

    // Wrap with axios and apply config extenders
    Object.keys(apiDeclaration).forEach((key) => {
        api[key] = async (params, { ...transportConfig } = {} as TransportConfig) => {
            let requestConfig: RequestConfig = {
                ...apiDeclaration[key](params),
                ...transportConfig,
            }

            console.log('CALLL')

            // TODO: request started handler

            try {
                const response = await fetch(requestConfig.url, requestConfig);
                console.log(response)
                let result = await response.json();
                if (successResponseHandlers) {
                    successResponseHandlers.forEach((handler) => {
                        result = handler(requestConfig,  result, );
                    });
                }

                return result;
            } catch (error) {
                let errorResult = error;

                if (errorResponseHandlers) {
                    errorResponseHandlers.forEach((handler) => {
                        errorResult = handler(errorResult);
                    });
                }

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

type ExtractApiMethodParamsType<T> = T extends ApiMethodDeclaration<infer P, infer D> ? P : any;

type ExtractApiMethodResponseDataType<T> = T extends ApiMethodDeclaration<infer P, infer D>
    ? D
    : any;

export type MakeServiceFromServiceDeclaration<T, AdditionalParams, DisplayName> =
    RequiredKeys<AdditionalParams> extends never
        ? {
              (
                  params: ExtractApiMethodParamsType<T>,
                  transportConfig?: TransportConfig & AdditionalParams,
              ): Promise<ExtractApiMethodResponseDataType<T>>;
              displayName: DisplayName;
          }
        : {
              (
                  params: ExtractApiMethodParamsType<T>,
                  transportConfig: TransportConfig & AdditionalParams,
              ): Promise<ExtractApiMethodResponseDataType<T>>;
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
