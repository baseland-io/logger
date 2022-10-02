# logger
Logging utility for Baseland projects

## Installation

```sh
npm install --save @baseland-io/logger
```

## Usage

```ts
import {log} from '@baseland-io/logger';
const options = {
  level: 'debug', // default: `info`
};
const logger = log(__filename, options); // /index.ts

logger.debug('Just a simple message');
// 2022-09-03 21:44:34 [/index.ts] [DEBUG] [UNKNOWN] [UNKNOWN] - Just a simple message

logger.info({
  label: 'custom-label',
  requestId: 'xxxx',
  message: 'My information message'
});
// 2022-09-03 21:42:03 [/index.ts] [INFO] [custom-label] [xxxx] - My message

const object = {
    food: 'pizza',
    list: [1, 'juice', 3],
    bag: {
        apples: 1,
        book: 'Lord of the Flies'
    }
}
logger.warn({
  label: 'object-stringify',
  requestId: 'xxxx',
  message: object
});
// 2022-09-03 21:53:16 [/index.ts] [WARN] [object-stringify] [xxxx] - {"food":"pizza","list":[1,"juice",3],"bag":{"apples":1,"book":"Lord of the Flies"}}

const error = new Error('This is an error');
logger.error({
  label: 'error-stack',
  requestId: 'xxxx',
  message: error
});
// 2022-09-03 21:43:10 [/index.ts] [ERROR] [error-stack] [xxxx] - Error: This is an error
//    at Object.<anonymous> (/app/index.ts:11:17)
//    at Module._compile (node:internal/modules/cjs/loader:1105:14)
//    at ...
```
