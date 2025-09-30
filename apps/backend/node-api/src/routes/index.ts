import express from 'express';
import { storeRouter } from './store.js';
import { adminRouter } from './admin.js';
import { cmsRouter } from './cms.js';
import { healthRouter } from './health.js';
import { getFlag } from '../lib/flags.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/api/store', storeRouter);
router.use('/api/admin', adminRouter);
router.use('/api/cms', cmsRouter);

router.get('/api/flags', async (_req, res) => {
  const [commerce, cms, analytics] = await Promise.all([
    getFlag('commerce'),
    getFlag('cms'),
    getFlag('analytics')
  ]);

  res.json({ commerce, cms, analytics });
});

export const rootRouter = router;
