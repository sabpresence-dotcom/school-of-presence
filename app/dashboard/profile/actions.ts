"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const fullName = formData.get("full_name") as string;

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        return { error: "Failed to update profile" };
    }

    revalidatePath("/dashboard/profile");
    return { success: true };
}

// Note: Avatar upload functionality removed since avatars storage bucket was deleted
// If you want to re-enable avatar uploads in the future:
// 1. Create a new storage bucket in Supabase
// 2. Set up storage policies
// 3. Re-implement uploadAvatar function
