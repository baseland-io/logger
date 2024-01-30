import { log } from './lib/logger';
import requestLogger from './lib/requestLogger';

import type { Config, BaselandLogger } from './lib/logger';

const logger = (filename: string, config: Config): BaselandLogger => {
  return log(filename, config);
};
export type { Config };
export { requestLogger };
export default logger;
