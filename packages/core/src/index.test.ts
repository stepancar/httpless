import { ApiMethodDeclaration, initApi } from './index';

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

    it('should call', async() => {
        await expect(() => testApi.testApiMethod({})).rejects;
    });
});
