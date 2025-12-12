import supabase from "../utils/supabaseClient";

export async function fetchMemories() {
  try {
    const { data, error } = await supabase.from("memories").select("*");

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
