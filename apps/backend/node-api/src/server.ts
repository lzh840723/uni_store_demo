import { config } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Node API listening on port ${config.port}`);
});
