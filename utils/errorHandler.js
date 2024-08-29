const { ValidationError } = require('express-validator');

exports.handleError = (res, error, customMessage = 'An error occurred') => {
    console.error('Error:', error);

    if (error instanceof ValidationError) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: error.array()
        });
    }

    if (error.isCustomError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }

    res.status(500).json({
        status: 'error',
        message: customMessage,
        error: error.message || 'Internal Server Error'
    });
};

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isCustomError = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.AppError = AppError;
