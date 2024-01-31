# @baseland-io/logger
[![Tests](https://github.com/baseland-io/logger/actions/workflows/main.yml/badge.svg)](https://github.com/baseland-io/logger/actions)
[![npm version](https://img.shields.io/npm/v/@baseland-io/logger.svg)](https://npmjs.org/package/@baseland-io/logger 'View this project on NPM')
[![npm downloads](https://img.shields.io/npm/dm/@baseland-io/logger)](https://www.npmjs.com/package/@baseland-io/logger)


Logging utility for Baseland projects

- `log` - winston logger
- `requestLogger` express middleware

## Installation

```sh
npm install --save @baseland-io/logger
```

## `log` Usage

```ts
import { log } from '@baseland-io/logger';
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

## `requestLogger` Usage
Logs a
```ts
import Express from 'express';
const app = Express();
app.use(requestLogger(logger, { logIpAddress: true }));

// [2024-01-31 08:05:24] [/src/server/index.ts] [info] [request-logger] [1100d7] [192.168.1.1] [/good-url] [GET] [200] - 3ms
// [2024-01-31 08:05:34] [/src/server/index.ts] [info] [request-logger] [692f11] [192.168.1.1] [/bad-url] [GET] [404] - 2ms
```

### Options
| Property | Type | Default Value | Description |
| --- | --- | --- | --- |
| `logIpAddress` | `boolean` | `false` | Whether or not the remote client ip address should be printed in the log statement |
| `logClientCaller` | `boolean` | `false` | Whether the `x-client-caller` header value should be printed in the log statement |

# Todo

- [ ] Better tests
