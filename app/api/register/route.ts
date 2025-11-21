"use server";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔥 Received body:", body);

    const { email, password, first_name, surname } = body;

    console.log("▶ first_name:", first_name);
    console.log("▶ surname:", surname);
    console.log("▶ email:", email);

    // 1️⃣ Create auth user
    const { data: authUser, error: authError } =
      await supabaseServer.auth.signUp({
        email,
        password,
      });

    console.log("🔥 Auth result:", authUser, authError);

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authUser?.user?.id;
    console.log("🔥 Auth user ID:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "Auth user ID missing" },
        { status: 500 }
      );
    }
    const test = await supabaseServer.from("roles").select("*");
    console.log("🔥 TEST QUERY:", test);
    console.log("🔥 BACKEND URL:", process.env.SUPABASE_URL);
    console.log(
      "🔥 BACKEND SERVICE KEY:",
      process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 15)
    );

    // 2️⃣ Fetch default role
    const { data: role, error: roleError } = await supabaseServer
      .from("roles")
      .select("id")
      .eq("name", "user")
      .single();

    console.log("🔥 Role lookup:", role, roleError);

    if (roleError || !role) {
      return NextResponse.json({ error: "Role not found" }, { status: 500 });
    }

    // 3️⃣ Update public.users
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        first_name,
        surname,
        role_id: role.id,
      })
      .eq("id", userId);

    console.log("🔥 Update result:", updateError);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err: any) {
    console.error("🔥 SERVER CRASH:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
