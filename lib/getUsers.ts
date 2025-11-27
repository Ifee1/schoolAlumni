import { supabase } from "@/lib/supabaseClient";

export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, surname, email, role_id, graduation_year");

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data || [];
}

// export async function getGroups() {
//   const { data, error } = await supabase.from("graduation_groups").select(`
//       id,
//       year,
//       name,
//       group_members:group_members!group_members_group_id_fkey(count)
//     `);

//   if (error) {
//     console.error(error);
//     return [];
//   }

//   return data.map((group) => ({
//     ...group,
//     member_count: group.group_members?.[0]?.count ?? 0,
//   }));
// }

export async function getGroups() {
  const { data, error } = await supabase.from("graduation_groups").select(`
      id,
      year,
      name,
      group_members:group_members!group_members_group_id_fkey(count)
    `);

  if (error) {
    console.error("getGroups error:", error);
    return [];
  }

  // Flatten count into a simple number
  const groups = data.map((group) => ({
    id: group.id,
    year: group.year,
    name: group.name,
    member_count: group.group_members?.[0]?.count ?? 0,
    _raw_group_members: group.group_members ?? null,
  }));

  return groups;
}

export async function assignUserToGraduationGroup(
  userId: string,
  year: number
) {
  // Checking if group exists
  const { data: group, error: groupError } = await supabase
    .from("graduation_groups")
    .select("id")
    .eq("year", year)
    .single();

  let groupId = group?.id;

  // creating groups if it doesn't exist
  if (!groupId) {
    const name = `Class of ${year}`;
    const { data: newGroup, error: createError } = await supabase
      .from("graduation_groups")
      .insert({ year, name })
      .select("id")
      .single();

    if (createError) {
      console.error("Group creation error:", createError);
      return;
    }

    groupId = newGroup.id;
  }

  // adding members to groups
  const { error: memberError } = await supabase.from("group_members").insert({
    user_id: userId,
    group_id: groupId,
  });

  if (memberError && !memberError.message.includes("duplicate key")) {
    console.error("Member assignment error:", memberError);
  }
}
