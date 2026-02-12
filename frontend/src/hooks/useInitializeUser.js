import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";

/**
 * Hook to sync Clerk user data to Convex database on sign-in
 * Works for both Google OAuth and email/password sign-ups
 * Automatically creates/updates user record when user authenticates
 */
export const useInitializeUser = () => {
    const { user, isLoaded } = useUser();
    const createOrUpdateUser = useMutation("functions:createOrUpdateUser");
    const hasSyncedRef = useRef(false);

    useEffect(() => {
        if (!isLoaded || !user) {
            return;
        }

        // Prevent multiple syncs for the same user
        if (hasSyncedRef.current && user.id) {
            return;
        }

        // Extract user data from Clerk
        const email = user.primaryEmailAddress?.emailAddress;
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        const name = (firstName && lastName)
            ? `${firstName} ${lastName}`
            : firstName || lastName || "User";
        const profileImage = user.imageUrl || null;

        if (!email) {
            console.warn("⚠️ User email not available yet - waiting for Clerk to load");
            return;
        }

        console.log("📝 Syncing user to Convex:", { email, name });

        // Call the mutation to create/update user in Convex
        createOrUpdateUser({
            email,
            name,
            profileImage,
        })
            .then((userId) => {
                hasSyncedRef.current = true;
                console.log("✅ User synced to Convex database:", { userId, email, name });
            })
            .catch((error) => {
                console.error("❌ Error syncing user to Convex:", error.message);
                // Don't mark as synced on error - allow retry on next effect
            });
    }, [user, isLoaded, createOrUpdateUser]);
};
