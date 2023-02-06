# httpless

The main idea behind "httpless" is to allow developers to make HTTP calls without having to think about the underlying details of the protocol. The library provides a way to define HTTP declarations only once, abstracting away the complexities of making the calls throughout the codebase. This means that developers can focus on their application logic and not have to worry about the specifics of making HTTP requests. The library also provides an easy way to test the application by using nock and Cypress, which allow the developer to mock functions instead of intercepting requests, further reducing the need to think about HTTP in the code. Overall, "httpless" aims to make working with HTTP calls as easy and intuitive as possible, allowing developers to focus on what's important - their application logic.



```ts
// create-client.ts
type Params = {
    name: string;
    age: number;
};

type Response = {
    clientId: string;
};

export const createClient: ApiMethodDeclaration<Params, Response> = (params) => ({
    url: '/client',
    method: 'POST',
    data: params, // function params will be passed to body of http request
});
```

```ts
// api.ts
import { initApi } from '@httpless/core'
import { createClient } from './create-client';

export const clientApi = initApi({
    createClient,
});
```


```ts
// business-logic.ts
import { clientApi } from './api';

function handleFormSubmit() {
    const userName = document.querySelector('#userName');
    const userAge = document.querySelector('#age');

    clientApi.createClient({ name: userName, age: userAge }) // typesafety
        .then((data) => {
            alert(data); // typesafety for response
        })
        .catch((err) => {
            console.error(err);
        });
}
```
