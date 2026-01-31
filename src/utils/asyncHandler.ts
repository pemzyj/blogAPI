import { Request, Response, NextFunction } from 'express';

/**
 * Async Handler Wrapper
 * Wraps async route handlers to automatically catch errors
 * and pass them to the error handling middleware
 * 
 * Usage:
 * router.get('/posts', asyncHandler(async (req, res) => {
 *   const posts = await getPosts();
 *   res.json(posts);
 * }));
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Alternative export name for convenience
 */
export const catchAsync = asyncHandler;

/**
 * Type-safe version with custom request type
 * Useful when you have custom properties on req (like req.user)
 * 
 * Usage:
 * router.get('/profile', asyncHandler<AuthRequest>(async (req, res) => {
 *   const user = req.user; // TypeScript knows about req.user
 *   res.json(user);
 * }));
 */
export const asyncHandlerTyped = <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req as T, res, next)).catch(next);
    };
};