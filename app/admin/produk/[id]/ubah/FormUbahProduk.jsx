"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";

export default function FormUbahProduk({ produk }) {
  const [state, formAction] = useActionState(ubahProduk, null);

  return (
    <FormProduk
      produk={produk}
      action={formAction}
      error={state?.error}
      labelTombol="Simpan perubahan"
    />
  );
}
