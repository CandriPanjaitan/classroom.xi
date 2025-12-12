import supabase from "../supabase/client";

export async function uploadMemory(file) {
  try {
    if (!file) {
      console.error("No file provided");
      return { error: "No file provided" };
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { data: _, error } = await supabase.storage
      .from("memories")
      .upload(fileName, file);

    if (error) {
      console.error("Upload Error:", error);
      return { error };
    }

    const { data: urlData } = supabase.storage
      .from("memories")
      .getPublicUrl(fileName);

    return {
      fileName,
      url: urlData.publicUrl,
    };
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return { error: err };
  }
}
