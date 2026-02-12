/**
 * Convex authentication configuration
 * Integrates Clerk JWT authentication with Convex
 */

export default {
    providers: [
        {
            // Use the Clerk Frontend API URL from environment
            // Format: https://verb-noun-00.clerk.accounts.dev (dev) or https://clerk.<domain>.com (prod)
            domain: process.env.CLERK_FRONTEND_API_URL,
            applicationID: "convex", // Required: tells Convex to look for this audience in JWT
        },
    ],
};
