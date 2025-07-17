require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/auth");
const protectedRoutes = require("./src/routes/protected");
const { applySecurityMiddleware } = require("./src/middleware/security");

const connectDB = require("./src/config/database");
connectDB();

    
const app = express();


applySecurityMiddleware(app);


app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});