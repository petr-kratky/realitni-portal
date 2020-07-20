import * as dotenv from 'dotenv'
import { start } from './start';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

start()
  .catch((err) => {
    console.error(`Error starting server: ${err.message}`, err);
    process.exit(-1);
  });
