import qs from 'qs';

import { ApiMethodDeclaration, initApi, baseUrl } from '@httpless/core';

import jsonMock from './test-data.json';
import { initServicesMock, mockApiMethod } from './mock-api-method';

describe('mockApiMethod', () => {
    afterEach(() => {
        initServicesMock();
    });

    it('should mock GET method', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            params,
        ) => ({
            url: '/test',
            method: 'GET',
            params,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: 'hey',
            },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'hey' });

        expect(result.field1).toEqual(true);
    });

    it('should mock POST method', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            data,
        ) => ({
            url: '/test',
            method: 'POST',
            data,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: 'hey',
            },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'hey' });

        expect(result.field1).toEqual(true);
    });

    it('should mock PUT method', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            data,
        ) => ({
            url: '/test',
            method: 'PUT',
            data,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: 'hey',
            },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'hey' });

        expect(result.field1).toEqual(true);
    });

    it('should mock DELETE method', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            data,
        ) => ({
            url: '/test',
            method: 'DELETE',
            data,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: 'hey',
            },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'hey' });

        expect(result.field1).toEqual(true);
    });

    it('should mock PATCH method', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            data,
        ) => ({
            url: '/test',
            method: 'PATCH',
            data,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: 'hey',
            },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'hey' });

        expect(result.field1).toEqual(true);
    });

    it('should mock each request to service', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            params,
        ) => ({
            url: '/test',
            method: 'GET',
            params,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: undefined,
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'foo' });

        expect(result.field1).toEqual(true);

        const result2 = await api.testApiMethod({ param1: 'bar' });

        expect(result2.field1).toEqual(true);
    });

    it('should mock all requests and request with params', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            params,
        ) => ({
            url: '/test',
            method: 'GET',
            params,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: { param1: 'foo' },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: undefined,
            result: {
                data: {
                    field1: false,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'foo' });

        expect(result.field1).toEqual(true);

        const result2 = await api.testApiMethod({ param1: 'bar' });

        expect(result2.field1).toEqual(false);
    });

    it('should mock request if one param is equal to mocked param', async () => {
        const testApiMethod: ApiMethodDeclaration<
            { param1: string; param2: string },
            { field1: boolean }
        > = (params) => ({
            url: '/test',
            method: 'GET',
            params,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param2: 'bar',
            },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: 'foo', param2: 'bar' });

        expect(result.field1).toEqual(true);
    });

    it('should mock request if param is array', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: number[] }, { field1: boolean }> = (
            incomingParams,
        ) => ({
            url: '/test',
            method: 'GET',
            params: incomingParams,
            paramsSerializer(params) {
                return qs.stringify(params, { arrayFormat: 'repeat' });
            },
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: [1, 2],
            },
            result: {
                data: {
                    field1: true,
                }
            },
        });

        const result = await api.testApiMethod({ param1: [1, 2] });

        expect(result.field1).toEqual(true);
    });

    it('should allow to receive function which returns mocked value', async () => {
        const testApiMethod: ApiMethodDeclaration<{ param1: string }, { field1: boolean }> = (
            params,
        ) => ({
            url: '/test',
            method: 'GET',
            params,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        let flag = true;

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: 'hey',
            },
            result: {
                data: () => {
                    const field1 = flag;

                    flag = !flag;

                    return {
                        field1,
                    };
                },
            },
        });

        const result1 = await api.testApiMethod({ param1: 'hey' });

        expect(result1.field1).toEqual(true);

        const result2 = await api.testApiMethod({ param1: 'hey' });

        expect(result2.field1).toEqual(false);
    });

    it('should allow pass imported json to response when declaration contains string literals', async () => {
        const testApiMethod: ApiMethodDeclaration<
            {
                param1: string;
            },
            {
                foo: 'BAR' | 'BAZ';
                bar: ReadonlyArray<{ baz: 'BAR' | 'FOO' }>;
            }
        > = (params) => ({
            url: '/test',
            method: 'GET',
            params,
        });
        const testApiDeclaration = { testApiMethod };

        const api = initApi(testApiDeclaration, {
            getConfigExtenders: (extenders) => extenders.add(baseUrl('http://localhost/test-api')),
        });

        mockApiMethod({
            baseUrl: 'http://localhost/test-api',
            apiMethodDeclaration: testApiDeclaration.testApiMethod,
            params: {
                param1: 'hey',
            },
            result: {
                data: jsonMock,
            },
        });

        const result = await api.testApiMethod({ param1: 'hey' });

        expect(result.foo).toEqual('BAR');
    });
});
