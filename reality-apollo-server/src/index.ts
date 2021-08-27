import * as path from 'path'
import * as dotenv from 'dotenv'

import { start } from './start';

if (process.env.NODE_ENV !== 'production') {
  const envFilePath: string = path.resolve('.env')
  console.log(`Loading environment variables from "${envFilePath}"`);
  dotenv.config({ path: envFilePath })
}

start()
  .catch((err) => {
    console.error(`Error starting server: ${err.message}`, err);
    process.exit(-1);
  });
