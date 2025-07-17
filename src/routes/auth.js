const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { authLimiter } = require("../middleware/security");
const { 
    signupValidation, 
    loginValidation, 
    tokenValidation, 
    handleValidationErrors 
} = require("../middleware/validation");

const router = express.Router();



router.post("/signup", authLimiter, signupValidation, handleValidationErrors, async (req, res) => {
    try {
        const existingUser = await User.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const payload = {
            name: req.body.name,
            role: req.body.role || 'user'
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const newUser = new User({
            name: req.body.name,
            password: hashedPassword,
            role: req.body.role || 'user',
            refreshToken: refreshToken
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


router.post("/login", authLimiter, loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const payload = {
            name: user.name,
            role: user.role
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


router.post("/token", authLimiter, tokenValidation, handleValidationErrors, async (req, res) => {
    const { token: refreshToken } = req.body;

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token"
                });
            }

            const payload = {
                name: decoded.name,
                role: decoded.role
            };

            const accessToken = generateAccessToken(payload);
            res.json({
                success: true,
                accessToken: accessToken
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


router.post("/logout", tokenValidation, handleValidationErrors, async (req, res) => {
    const { token: refreshToken } = req.body;

    try {
        await User.updateOne(
            { refreshToken },
            { $unset: { refreshToken: 1 } }
        );
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;