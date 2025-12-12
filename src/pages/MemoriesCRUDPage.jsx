import { useCallback, useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import { Link } from "react-router-dom";

export default function MemoriesCRUDPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("memories").select("*").order("id", { ascending: false });
    if (!error) setMemories(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchMemories();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchMemories]);

  async function deleteMemory(id, filePath) {
    try {
      if (filePath) await supabase.storage.from("memories").remove([filePath]).catch(()=>{});
      await supabase.from("memories").delete().eq("id", id);
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl mb-4 font-bold">Memories CRUD</h1>

      <Link to="/admin/upload-memory" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-800">
        Upload Memory
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : memories.length === 0 ? (
          <p>No memories found.</p>
        ) : (
          memories.map((m) => (
            <div key={m.id} className="bg-gray-800 p-3 rounded-lg">
              <img src={m.image_url} alt="memory" className="rounded w-full h-48 object-cover" />
              <p className="mt-2 text-sm">{m.caption || m.title || ""}</p>
              <button onClick={() => deleteMemory(m.id, m.file_path)} className="mt-3 w-full bg-red-600 hover:bg-red-800 py-2 rounded">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
