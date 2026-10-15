import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createAdminClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum dikonfigurasi di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Method setAll dipanggil dari Server Component, aman diabaikan
        }
      },
    },
  });
}

export { createAdminClient as createClient };
export default createAdminClient;

