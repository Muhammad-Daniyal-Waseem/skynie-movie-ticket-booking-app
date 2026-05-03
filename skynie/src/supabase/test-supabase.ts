import { supabase } from "@/src/supabase/client";

export const fetchTestData = async () => {
  try {
    console.log("📡 Fetching test data...");

    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await supabase
      .from("test_table")
      .select("*");

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.log(
      "❌ SERVICE ERROR:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
};