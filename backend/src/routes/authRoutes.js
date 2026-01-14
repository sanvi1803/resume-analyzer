import express from "express";
import { verifyClerkToken } from "../middleware/authMiddleware.js";
import { getOrCreateUser } from "../services/convexService.js";

const router = express.Router();

/**
 * POST /api/auth/sync
 * Sync Clerk user with Convex database
 */
router.post("/sync", verifyClerkToken, async (req, res) => {
    try {
        const { email, name, profileImage } = req.body;
        const clerkId = req.user.clerkId;

        const userId = await getOrCreateUser(clerkId, email || req.user.email, name || req.user.name, profileImage);

        res.json({
            success: true,
            userId,
            message: "User synchronized successfully",
        });
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to sync user",
        });
    }
});

/**
 * GET /api/auth/user
 * Get current user info
 */
router.get("/user", verifyClerkToken, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                clerkId: req.user.clerkId,
                email: req.user.email,
                name: req.user.name,
            },
        });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to get user",
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side mostly, this just confirms)
 */
router.post("/logout", verifyClerkToken, (req, res) => {
    res.json({
        success: true,
        message: "Logged out successfully",
    });
});

export default router;
