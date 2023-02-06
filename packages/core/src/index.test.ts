import fetchMock from 'jest-fetch-mock';
import { ApiMethodDeclaration, initApi } from './index';

fetchMock.enableMocks();

describe('initApi', () => {
    const testApiMethod: ApiMethodDeclaration<{}, {}> = (params: {}) => ({
        url: '/test',
        method: 'POST',
        data: params,
    });

    const testApiDeclaration = {
        testApiMethod,
    }

    const testApi = initApi(testApiDeclaration, {});

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('should call fetch', async() => {
        fetchMock.mockOnce('{"test": 222}');

        await expect(testApi.testApiMethod({})).resolves.toEqual({test: 222})
    });
});
