"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireAuth() {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

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

export async function tambahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const nama = form?.get ? form.get("nama") : null;
  const hargaRaw = form?.get ? form.get("harga") : null;
  const kategori = form?.get ? form.get("kategori") : null;
  const fotoUrl = form?.get ? form.get("foto_url") : null;
  const deskripsi = form?.get ? form.get("deskripsi") : null;

  const namaClean = String(nama || "").trim();
  if (!namaClean) {
    return { error: "Nama produk wajib diisi." };
  }

  if (hargaRaw === null || hargaRaw === undefined || String(hargaRaw).trim() === "") {
    return { error: "Harga produk wajib diisi." };
  }

  const harga = parseInt(String(hargaRaw), 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka yang valid dan tidak boleh negatif." };
  }

  const kategoriClean = String(kategori || "").trim() || null;
  const fotoClean = String(fotoUrl || "").trim() || null;
  const deskripsiClean = String(deskripsi || "").trim() || null;

  const { error: insertError } = await supabase.from("produk").insert({
    nama: namaClean,
    harga,
    kategori: kategoriClean,
    foto_url: fotoClean,
    deskripsi: deskripsiClean,
  });

  if (insertError) {
    return { error: insertError.message || "Gagal menyimpan produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const id = form?.get ? form.get("id") : null;
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const nama = form?.get ? form.get("nama") : null;
  const hargaRaw = form?.get ? form.get("harga") : null;
  const kategori = form?.get ? form.get("kategori") : null;
  const fotoUrl = form?.get ? form.get("foto_url") : null;
  const deskripsi = form?.get ? form.get("deskripsi") : null;

  const namaClean = String(nama || "").trim();
  if (!namaClean) {
    return { error: "Nama produk wajib diisi." };
  }

  if (hargaRaw === null || hargaRaw === undefined || String(hargaRaw).trim() === "") {
    return { error: "Harga produk wajib diisi." };
  }

  const harga = parseInt(String(hargaRaw), 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka yang valid dan tidak boleh negatif." };
  }

  const kategoriClean = String(kategori || "").trim() || null;
  const fotoClean = String(fotoUrl || "").trim() || null;
  const deskripsiClean = String(deskripsi || "").trim() || null;

  const { error: updateError } = await supabase
    .from("produk")
    .update({
      nama: namaClean,
      harga,
      kategori: kategoriClean,
      foto_url: fotoClean,
      deskripsi: deskripsiClean,
    })
    .eq("id", id);

  if (updateError) {
    return { error: updateError.message || "Gagal mengubah produk." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/produk/${id}/ubah`);
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function hapusProduk(idOrFormData) {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const id = idOrFormData instanceof FormData ? idOrFormData.get("id") : idOrFormData;
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const { error: deleteError } = await supabase
    .from("produk")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message || "Gagal menghapus produk." };
  }

  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  return { success: true };
}

