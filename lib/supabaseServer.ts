// import { createClient } from "@supabase/supabase-js";

// export const supabaseServer = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   { auth: { persistSession: false } }
// );

import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
