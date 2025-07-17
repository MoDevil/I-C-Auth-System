const { body, validationResult } = require('express-validator');

const signupValidation = [
    body('name')
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be between 3 and 30 characters')
        .trim()
        .toLowerCase()
        .escape()
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Name can only contain letters, numbers, and underscores'),
    
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"')
];

const loginValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .toLowerCase()
        .escape(),
    
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password is required')
];

const tokenValidation = [
    body('token')
        .notEmpty()
        .withMessage('Token is required')
        .isJWT()
        .withMessage('Invalid token format')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation,
    tokenValidation,
    handleValidationErrors
};