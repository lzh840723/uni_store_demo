import { Request, Response, NextFunction } from 'express';
import { getFlag } from '../lib/flags.js';

type FlagKey = 'commerce' | 'cms' | 'analytics';

export function requireFlag(flag: FlagKey) {
  return async function flagGuard(_req: Request, res: Response, next: NextFunction) {
    const enabled = await getFlag(flag);
    if (!enabled) {
      return res.status(503).json({ message: `Feature ${flag} is disabled` });
    }
    return next();
  };
}
