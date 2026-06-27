import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    // Access the RLS-scoped Supabase client verified from the user's JWT
    const { data, error } = await ctx.supabase
      .from("todos")
      .select("*");

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return Response.json(data);
  }),
};
