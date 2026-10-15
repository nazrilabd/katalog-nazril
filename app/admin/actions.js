"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function login(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const email = form?.get ? form.get("email") : null;
  const password = form?.get ? form.get("password") : null;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    const pesan =
      error.message === "Invalid login credentials"
        ? "Email atau password salah."
        : (error.message || "Login gagal. Silakan coba lagi.");
    return { error: pesan };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createAdminClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}

