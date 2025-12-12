// File: src/utils/uploadMemory.js
import supabase from "./supabaseClient";

export async function uploadMemory({ file, title = null, description = null, category = null, style = null }) {
  try {
    if (!file) return { success: false, error: "No file provided" };

    const ext = file.name.split(".").pop();
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload ke storage (tidak menyimpan 'data' kalau tidak dipakai)
    const { error: uploadError } = await supabase.storage
      .from("memories")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return { success: false, error: uploadError.message || uploadError };
    }

    // Ambil public URL
    const { data: publicUrlData } = supabase.storage.from("memories").getPublicUrl(fileName);
    const image_url = publicUrlData?.publicUrl || null;

    if (!image_url) {
      return { success: false, error: "Gagal ambil public URL" };
    }

    // Simpan metadata ke tabel `memories`
    const { data: insertData, error: insertError } = await supabase
      .from("memories")
      .insert([
        { title, description, category, display_style: style, image_url }
      ])
      .select();

    if (insertError) {
      console.error("Insert DB Error:", insertError);
      return { success: false, error: insertError.message || insertError };
    }

    return { success: true, data: insertData[0] || null, image_url };
  } catch (err) {
    console.error("Unexpected uploadMemory error:", err);
    return { success: false, error: err.message || err };
  }
}
