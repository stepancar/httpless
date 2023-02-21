import { stringify } from 'querystring';

import isEmpty from 'lodash.isempty';
import matches from 'lodash.matches';
import nock from 'nock';
import qs from 'qs';
import { DeepPartial } from 'utility-types';

import { DeepReplacePrimitiveLiteralsWithPrimitive } from './types';
import { ApiMethodDeclaration, RequestConfig } from '@httpless/core';

/**
 * Call this function on server start to clean all nock mocks
 */
export function initServicesMock() {
    nock.cleanAll();
}

/**
 * Mocks api method call with given params and response
 */
export function mockApiMethod<ParamsData extends nock.DataMatcherMap, ResponseData, ErrorData>({
    baseUrl,
    apiMethodDeclaration,
    params,
    result,
}:
    {
        baseUrl: string;
        apiMethodDeclaration: ApiMethodDeclaration<ParamsData, ResponseData>;
        params?: DeepPartial<ParamsData>;
        result: {
            data: DeepReplacePrimitiveLiteralsWithPrimitive<ResponseData>
            | ErrorData
            | {
                (): DeepReplacePrimitiveLiteralsWithPrimitive<ResponseData> | ErrorData;
            },
            httpStatusCode?: number,
            delay?: number,
        };
    }
) {
    let httpConfig: RequestConfig;
    let pathname: string;

    try {
        httpConfig = apiMethodDeclaration({ ...params } as ParamsData);
        pathname = httpConfig.url as string;
    } catch (e) {
        console.error(e);

        throw new Error(
            'It seems like you missed some params. Please check your mock data and try again',
        );
    }

    const scope = nock(baseUrl).persist();

    let interceptors: nock.Interceptor | undefined;

    if (httpConfig.method === 'GET') {
        interceptors = scope.get(pathname);
    } else {
        const matcher = (body: object) => {
            let result;

            if (httpConfig.body) {
                result = matches(httpConfig.body)(body);
            } else {
                result = true;
            }

            return result;
        };

        if (httpConfig.method === 'POST') {
            interceptors = scope.post(pathname, matcher);
        } else if (httpConfig.method === 'PUT') {
            interceptors = scope.put(pathname, matcher);
        } else if (httpConfig.method === 'DELETE') {
            interceptors = scope.delete(pathname, matcher);
        } else if (httpConfig.method === 'PATCH') {
            interceptors = scope.patch(pathname, matcher);
        }
    }

    interceptors = interceptors.query((body) => {
        if (httpConfig.params && !isEmpty(httpConfig.params)) {
            const parsedBody = qs.parse(stringify(body));
            const parsedParams = qs.parse(
                (httpConfig.paramsSerializer || qs.stringify)(httpConfig.params),
            );

            return matches(parsedParams)(parsedBody);
        }

        return true;
    });

    return interceptors?.delay(result.delay || 0)?.reply(result.httpStatusCode || 200, result.data as any);
}
