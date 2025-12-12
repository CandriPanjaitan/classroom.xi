import { useEffect, useState, useCallback } from "react";
import supabase from "../supabase/client";


export default function GalleryPage() {
  const [memories, setMemories] = useState([]);
  const [filter, setFilter] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const fetchMemories = useCallback(async () => {
    let q = supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter) q = q.eq("category", filter);

    const { data } = await q;
    setMemories(data || []);
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMemories();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchMemories]);

  async function like(id, currentLikes) {
    await supabase
      .from("memories")
      .update({ likes: currentLikes + 1 })
      .eq("id", id);
    fetchMemories();
  }

  async function remove(id, url) {
    if (!confirm("Hapus memory ini?")) return;

    const fileName = url.split("/").pop();
    await supabase.storage.from("memories").remove([fileName]);
    await supabase.from("memories").delete().eq("id", id);
    fetchMemories();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Galeri Memory</h1>

      <div className="flex gap-2 mb-4">
        <button
          className="px-3 py-1 bg-gray-700 rounded"
          onClick={() => setFilter("")}
        >
          Semua
        </button>
        <button
          className="px-3 py-1 bg-gray-700 rounded"
          onClick={() => setFilter("acara")}
        >
          Acara
        </button>
        <button
          className="px-3 py-1 bg-gray-700 rounded"
          onClick={() => setFilter("kelas")}
        >
          Kelas
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {memories.map((item) => (
          <div key={item.id} className="relative group">
            <img
              src={item.image_url}
              className={
                item.display_style === "circle"
                  ? "rounded-full w-full h-40 object-cover cursor-pointer"
                  : item.display_style === "rectangle"
                  ? "rounded-lg w-full h-52 object-cover cursor-pointer"
                  : "rounded-lg w-full h-40 object-cover cursor-pointer"
              }
              onClick={() => setLightbox(item)}
            />

            <div className="flex justify-between mt-2">
              <button onClick={() => like(item.id, item.likes)}>
                ❤️ {item.likes}
              </button>
              <button
                className="text-red-400"
                onClick={() => remove(item.id, item.image_url)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox.image_url} className="max-h-[90vh] rounded-lg" />
        </div>
      )}
    </div>
  );
}
