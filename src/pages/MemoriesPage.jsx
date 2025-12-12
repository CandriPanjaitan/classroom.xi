// File: src/pages/MemoriesPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import supabase from "../supabase/client";

export default function MemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("fetchMemories error:", error);
        setMemories([]);
        return;
      }

      setMemories(data || []);
    } catch (err) {
      console.error("unexpected fetch error:", err);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }, []); // kosong kalau tidak ada dependency

  useEffect(() => {
    const t = setTimeout(() => {
      fetchMemories();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchMemories]);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6 font-bold">Kumpulan Memori</h1>

      {loading ? (
        <p>Loading...</p>
      ) : memories.length === 0 ? (
        <p>Belum ada memori ditambahkan.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {memories.map((m) => (
            <div key={m.id} className="bg-white shadow rounded p-4">
              <img src={m.image_url} alt={m.title || "Memori"} className="rounded w-full h-48 object-cover" />
              {m.title && <h2 className="text-lg font-semibold mt-2">{m.title}</h2>}
              {m.description && <p className="text-sm">{m.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
