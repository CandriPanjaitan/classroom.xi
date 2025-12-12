import supabase from "../supabase/client";

export async function fetchMemories() {
  try {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Memories Error:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Unexpected fetch error:", err);
    return [];
  }
}
