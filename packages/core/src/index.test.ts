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

    describe('passes settings to fetch', () => {
        it('passes url and method correctly', async() => {
            // Arrange
            const testApiMethod: ApiMethodDeclaration<{}, {}> = (params: {}) => ({
                url: '/test',
                method: 'POST',
                data: params,
            });

            const testApi = initApi({
                testApiMethod,
            }, {});

            // Act
            fetchMock.mockIf((request) => {
                return request.url === '/test' && request.method === 'POST';
            }, '{"test": 222}');

            // Assert
            await expect(testApi.testApiMethod({})).resolves.toEqual({test: 222})
        });

        it('passes body correctly', async() => {
            // Arrange
            const testApiMethod: ApiMethodDeclaration<{ clientId: string; }, {}> = (data) => ({
                url: '/test',
                method: 'POST',
                data
            });

            const testApi = initApi({
                testApiMethod,
            }, {});

            fetchMock.mockIf((request) => {
                return request.url === '/test' && request.method === 'POST';
            }, '{"test": 222}');

            // Act

            const response = await testApi.testApiMethod({clientId: 'test'});
            
            // Assert
            expect(response).toEqual({test: 222})
        });
    });

    it('should pass parameters to fetch', async() => {
        fetchMock.mockOnce('{"test": 222}');

        await expect(testApi.testApiMethod({})).resolves.toEqual({test: 222})
    });

    it('should reject if fetch rejected', async() => {
        fetchMock.mockRejectOnce(new Error('test error'));

        await expect(testApi.testApiMethod({})).rejects.toThrowError('test error')
    });

    it('should reject if fetch returned non json response', async() => {
        fetchMock.mockOnce('{"test" 222');

        await expect(testApi.testApiMethod({})).rejects.toThrowError('invalid json response body at  reason: Unexpected number in JSON at position 8')
    });
});
