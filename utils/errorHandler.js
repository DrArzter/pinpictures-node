const { validationResult } = require('express-validator');

exports.handleError = (res, error, customMessage = 'An error occurred') => {
    console.error('Error:', error);

    const validationErrors = validationResult(error);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: validationErrors.array()
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
