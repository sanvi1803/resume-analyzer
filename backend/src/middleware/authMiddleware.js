import jwt from "jsonwebtoken";

/**
 * Middleware to verify Clerk JWT token from Authorization header
 * Expected format: Bearer <token>
 */
export const verifyClerkToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Missing or invalid authorization header",
            });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        // In production, verify with Clerk's public key
        // For now, we're relying on Clerk's middleware to validate
        // The token contains the user's clerkId in the 'sub' claim
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.sub) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        // Attach user info to request
        req.user = {
            clerkId: decoded.sub,
            email: decoded.email,
            name: decoded.name,
        };

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({
            success: false,
            error: "Failed to verify token",
        });
    }
};

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (req, res, next) => {
    if (!req.user || !req.user.clerkId) {
        return res.status(401).json({
            success: false,
            error: "Authentication required",
        });
    }
    next();
};

/**
 * Optional user middleware - doesn't fail if no token
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const decoded = jwt.decode(token);

            if (decoded && decoded.sub) {
                req.user = {
                    clerkId: decoded.sub,
                    email: decoded.email,
                    name: decoded.name,
                };
            }
        }

        next();
    } catch (error) {
        // Silent fail - user is optional
        next();
    }
};
