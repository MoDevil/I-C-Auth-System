const helmet = require('helmet');
const { sanitize } = require('express-mongo-sanitize');
const xss = require("xss");
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});


const xssProtection = (req, res, next) => {
    if (req.body && typeof req.body === "object") {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === "string") {
                req.body[key] = xss(req.body[key]);
            }
        });
    }
    next();
};


const mongoSanitize = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        sanitize(req.body);
    }
    next();
};

const applySecurityMiddleware = (app) => {
    app.use(helmet());
    app.use(generalLimiter);
    app.use(mongoSanitize);
    app.use(xssProtection);
};

module.exports = {
    applySecurityMiddleware,
    authLimiter,
    generalLimiter
};