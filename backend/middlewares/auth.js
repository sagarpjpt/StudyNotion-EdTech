const jwt = require("jsonwebtoken");

// auth
exports.auth = async (req, res, next) => {
    try {
        // access token from cookies
        const token = req.cookies.token || req.header("Authorization")?.replace(/Bearer\s+/i, "").trim();
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. No token provided.",
            });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Attach decoded token data to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("error in auth middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access. Invalid token.",
        });
    }
};

// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Students only.",
            });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Instructors only.",
            });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only.",
            });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};