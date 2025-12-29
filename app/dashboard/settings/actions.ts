"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateNotifications(formData: FormData) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const emailNotifications = formData.get("email_notifications") === "on";
    const marketingUpdates = formData.get("marketing_updates") === "on";

    const { error } = await supabase
        .from("profiles")
        .update({
            email_notifications: emailNotifications,
            marketing_updates: marketingUpdates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        return { error: "Failed to update settings" };
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function changePassword(formData: FormData) {
    const supabase = createServerClient();
    // No need to check user, updateUser checks session

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!password || password.length < 6) {
        return { error: "Password must be at least 6 characters" };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
