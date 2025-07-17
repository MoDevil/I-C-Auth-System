const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

const router = express.Router();


router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: `Welcome ${req.user.name}`,
        user: {
            name: req.user.name,
            role: req.user.role
        }
    });
});


router.get("/admin", authenticateToken, authorizeRole(["admin"]), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin",
        user: {
            name: req.user.name,
            role: req.user.role
        }
    });
});

module.exports = router;