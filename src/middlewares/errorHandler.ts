import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/error.js';
import { ZodError } from 'zod';

/**
 * Interface for standardized error response
 */
interface ErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errors?: any[];
    stack?: string;
}

/**
 * Main Error Handler Middleware
 * Catches all errors and formats them consistently
 * MUST be the last middleware registered
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('🔴 ERROR CAUGHT:', err);

    // ========================================
    // 1. HANDLE ZOD VALIDATION ERRORS
    // ========================================
    if (err instanceof ZodError) {
        const errors = err.issues.map(issue => {
            // Handle root-level errors (when entire body is invalid)
            if (issue.path.length === 0) {
                return {
                    field: 'body',
                    message: issue.message || 'Request body is required or invalid'
                };
            }

            return {
                field: issue.path.join('.'),
                message: issue.message
            };
        });

        return res.status(422).json({
            success: false,
            statusCode: 422,
            message: 'Validation failed',
            errors
        } as ErrorResponse);
    }

    // ========================================
    // 2. HANDLE JWT ERRORS
    // ========================================
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'Invalid authentication token. Please login again.'
        } as ErrorResponse);
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'Authentication token has expired. Please login again.'
        } as ErrorResponse);
    }

    // ========================================
    // 3. HANDLE POSTGRESQL/DATABASE ERRORS
    // ========================================
    if ((err as any).code) {
        const dbError = handleDatabaseError(err);
        
        const response: ErrorResponse = {
            success: false,
            statusCode: dbError.statusCode,
            message: dbError.message
        };

        if (process.env.NODE_ENV === 'development' && err.stack) {
            response.stack = err.stack;
        }

        return res.status(dbError.statusCode).json(response);
    }

    // ========================================
    // 4. HANDLE CUSTOM APP ERRORS
    // ========================================
    if (err instanceof AppError) {
        const response: ErrorResponse = {
            success: false,
            statusCode: err.statusCode,
            message: err.message
        };

        // Include validation errors if present
        if (err instanceof ValidationError && err.errors.length > 0) {
            response.errors = err.errors;
        }

        // Include stack trace in development
        if (process.env.NODE_ENV === 'development' && err.stack) {
            response.stack = err.stack;
        }

        return res.status(err.statusCode).json(response);
    }

    // ========================================
    // 5. HANDLE MULTER ERRORS (File Upload)
    // ========================================
    if (err.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: `File upload error: ${err.message}`
        } as ErrorResponse);
    }

    // ========================================
    // 6. HANDLE UNKNOWN/UNEXPECTED ERRORS
    // ========================================
    console.error('💥 UNEXPECTED ERROR:', err);

    const response: ErrorResponse = {
        success: false,
        statusCode: 500,
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong. Please try again later.'
            : err.message || 'Internal server error'
    };

    // Only show stack trace in development
    if (process.env.NODE_ENV === 'development' && err.stack) {
        response.stack = err.stack;
    }

    return res.status(500).json(response);
};

/**
 * Handle PostgreSQL Database Errors
 * Maps database error codes to user-friendly messages
 */
const handleDatabaseError = (err: any): AppError => {
    const code = err.code;

    switch (code) {
        // ========================================
        // UNIQUE VIOLATION (Duplicate Entry)
        // ========================================
        case '23505': {
            // Extract field name from error message
            // Example: "Key (email)=(test@example.com) already exists"
            const match = err.detail?.match(/Key \((.*?)\)=/);
            const field = match ? match[1] : 'field';
            
            return new AppError(
                `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
                409
            );
        }

        // ========================================
        // FOREIGN KEY VIOLATION
        // ========================================
        case '23503': {
            // Extract table/column info
            const match = err.detail?.match(/Key \((.*?)\)=\((.*?)\)/);
            const field = match ? match[1] : 'resource';
            
            return new AppError(
                `Referenced ${field} does not exist`,
                400
            );
        }

        // ========================================
        // NOT NULL VIOLATION
        // ========================================
        case '23502': {
            const column = err.column || 'field';
            
            return new AppError(
                `${column.charAt(0).toUpperCase() + column.slice(1)} is required`,
                400
            );
        }

        // ========================================
        // INVALID TEXT REPRESENTATION
        // ========================================
        case '22P02': {
            return new AppError(
                'Invalid data format. Please check your input.',
                400
            );
        }

        // ========================================
        // CHECK VIOLATION
        // ========================================
        case '23514': {
            // Extract constraint name if available
            const constraint = err.constraint || 'value';
            
            return new AppError(
                `Invalid value for ${constraint}`,
                400
            );
        }

        // ========================================
        // UNDEFINED COLUMN
        // ========================================
        case '42703': {
            return new AppError(
                'Invalid field in query',
                400
            );
        }

        // ========================================
        // UNDEFINED TABLE
        // ========================================
        case '42P01': {
            console.error('Database table does not exist:', err);
            return new AppError(
                'Database configuration error',
                500
            );
        }

        // ========================================
        // UNKNOWN DATABASE ERROR
        // ========================================
        default: {
            console.error('Unknown database error:', err);
            return new AppError(
                process.env.NODE_ENV === 'production'
                    ? 'Database error occurred'
                    : `Database error: ${err.message}`,
                500
            );
        }
    }
};

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 * MUST be registered AFTER all route handlers
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        suggestion: 'Please check the API documentation for available endpoints'
    } as ErrorResponse);
};

/**
 * Async Error Wrapper (Optional but recommended)
 * Alternative to using try-catch in every async route
 */
export const asyncErrorHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};