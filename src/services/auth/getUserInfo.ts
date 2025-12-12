/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/getUserInfo.ts
"use server"

import { cookies } from "next/headers";
import { IUser } from "@/types/user.interface";

export const getUserInfo = async (): Promise<{
    success: boolean;
    user?: IUser;
    message?: string;
}> => {
    try {
        // Get access token from cookies
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            };
        }

        // Fetch from your backend API
        const response = await fetch(`${process.env.API_URL}/user/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Send token in Authorization header (Bearer token)
                "Authorization": `${accessToken}`,
                // OR send in Cookie header if your backend checks cookies
                "Cookie": `accessToken=${accessToken}`
            },
            // Important: credentials should be 'same-origin' or 'include' if sending cookies
            credentials: "include",
            cache: "no-store" // Don't cache user data
        });

        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    message: "Unauthorized - Invalid token"
                };
            }
            throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            return {
                success: true,
                user: data.data
            };
        } else {
            return {
                success: false,
                message: data.message || "Failed to fetch user info"
            };
        }
    } catch (err: any) {
        console.error("Error in getUserInfo:", err);
        return {
            success: false,
            message: err.message || "Internal server error"
        };
    }
}