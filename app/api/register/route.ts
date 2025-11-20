"use server";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  console.log("SERVER KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log("ANON KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { email, password } = await req.json();
  console.log("Received email:", email);

  // 1️⃣ Create the user in Supabase Auth
  const { data: authUser, error: authError } = await supabaseServer.auth.signUp(
    {
      email,
      password,
    }
  );

  console.log("Auth user:", authUser, "Auth error:", authError);

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // 2️⃣ Get default role id ('user')
  // const { data: role, error: roleError } = await superbaseServer
  //   .from("roles")
  //   .select("id")
  //   .eq("name", "user")
  //   .single();
  // console.log("Role:", role, "Role error:", roleError);

  // if (roleError || !role) {
  //   return NextResponse.json(
  //     { error: "Default role not found" },
  //     { status: 500 }
  //   );
  // }

  // 3️⃣ Insert the user into your users table
  // const { error: insertError } = await superbaseServer.from("users").insert({
  //   email,
  //   role_id: role.id,
  //   created_at: new Date(),
  // });
  // console.log("Insert error:", insertError);

  // if (insertError) {
  //   return NextResponse.json({ error: insertError.message }, { status: 500 });
  // }
  // console.log("insertError:", insertError);
  // console.log("Inserting into users table...");

  return NextResponse.json({ message: "User registered successfully" });
}
