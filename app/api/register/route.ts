"use server";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { assignUserToGraduationGroup } from "@/lib/getUsers";

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer();
  try {
    const body = await req.json();

    const { email, password, first_name, surname, graduation_year } = body;

    // 1️⃣ Create auth user
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authUser?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Auth user ID missing" },
        { status: 500 }
      );
    }

    // 2️⃣ Fetch default role
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "user")
      .single();

    if (roleError || !role) {
      return NextResponse.json({ error: "Role not found" }, { status: 500 });
    }

    // 3️⃣ Update public.users
    const { error: updateError } = await supabase
      .from("users")
      .update({
        first_name,
        surname,
        role_id: role.id,
        graduation_year,
      })
      .eq("id", userId);
    await assignUserToGraduationGroup(userId, graduation_year);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
