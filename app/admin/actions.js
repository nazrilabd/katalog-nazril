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

export async function gantiPassword(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const passwordBaru = form?.get ? form.get("password_baru") : null;
  const konfirmasiPassword = form?.get ? form.get("konfirmasi_password") : null;

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: String(passwordBaru),
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: "Password berhasil diganti." };
}
