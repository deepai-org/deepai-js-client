const DeepAI = require('../lib/core/DeepAI');
const mockAxios = require('jest-mock-axios').default;
jest.mock('axios', () => mockAxios);

import "regenerator-runtime/runtime";

const APIKEY = 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'

it('should make a POST request and return data', async () => {
    const mockedDeepAI = new DeepAI(mockAxios);

    mockedDeepAI.setApiKey(APIKEY);
    
    const response = mockedDeepAI.callStandardApi('someModel', {someInput: 'testInput'});
    
    mockAxios.mockResponse({
        data: 'mocked data'
    });

    await expect(response).resolves.toEqual('mocked data');
});


