"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    }

    loadProfile();
  }, []);

  useEffect(() => {
    const processOAuth = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("OAuth error:", sessionError.message);
        return;
      }

      const session = sessionData?.session;

      // No session → failed login
      if (!session) {
        console.error("No session found after OAuth");
        return;
      }

      const user = session.user;

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("graduation_year")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError.message);
        return;
      }

      if (!profile?.graduation_year) {
        router.push("/complete-profile");
      } else {
        router.push("/");
      }
    };
    processOAuth();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {profile && !profile.graduation_year && (
        <p className="text-center font-medium">Please complete your profile</p>
      )}
    </div>
  );
}
