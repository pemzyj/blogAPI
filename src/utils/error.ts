/**
 * Base Application Error Class
 * All custom errors extend from this class
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        
        this.statusCode = statusCode;
        this.isOperational = true; // Indicates this is a known/expected error
        
        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);
        
        // Set the prototype explicitly (TypeScript requirement)
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * 400 Bad Request Error
 * Use when: Client sends invalid data (missing fields, wrong format, etc.)
 */
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad Request') {
        super(message, 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * 401 Unauthorized Error
 * Use when: User is not authenticated (no token, invalid token, expired token)
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Not authenticated. Please login.') {
        super(message, 401);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

/**
 * 403 Forbidden Error
 * Use when: User is authenticated but doesn't have permission
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Access denied. You do not have permission to perform this action.') {
        super(message, 403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

/**
 * 404 Not Found Error
 * Use when: Requested resource doesn't exist
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * 409 Conflict Error
 * Use when: Request conflicts with existing data (duplicate email, username, etc.)
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

/**
 * 422 Validation Error
 * Use when: Request data fails validation (Zod, custom validation)
 */
export class ValidationError extends AppError {
    public readonly errors: any[];

    constructor(message: string = 'Validation failed', errors: any[] = []) {
        super(message, 422);
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * 500 Internal Server Error
 * Use when: Unexpected server errors occur
 */
export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 500);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}