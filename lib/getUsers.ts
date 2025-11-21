import { supabase } from "@/lib/supabaseClient";

export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, surname, email, role_id");

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data || [];
}
