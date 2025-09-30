import { Request, Response, NextFunction } from 'express';

export function requireRole(role: 'ADMIN' | 'CUSTOMER') {
  return function roleGuard(req: Request, res: Response, next: NextFunction) {
    const headerRole = req.headers['x-demo-role'];
    const cookieRole = req.cookies?.role;
    const resolved = typeof headerRole === 'string' ? headerRole : cookieRole;

    if (!resolved || resolved.toUpperCase() !== role) {
      return res.status(403).json({ message: 'Forbidden: role mismatch' });
    }

    return next();
  };
}
