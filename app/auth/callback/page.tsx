"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processOAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("OAuth error:", error.message);
        return;
      }

      // Session available → logged in
      router.push("/");
    };

    processOAuth();
  }, [router]);

  return <p>Signing you in...</p>;
}
