// File: src/pages/UploadMemoryPage.jsx
import React, { useState } from "react";
import { uploadMemory } from "../utils/uploadMemory";

export default function UploadMemoryPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [style, setStyle] = useState("Full Width");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      alert("Pilih gambar terlebih dahulu!");
      return;
    }

    setLoading(true);

    const result = await uploadMemory({
      file,
      title,
      description,
      category,
      style,
    });

    setLoading(false);

    if (!result.success) {
      alert("Upload gagal: " + result.error);
      return;
    }

    alert("Upload Berhasil!");

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("Kegiatan");
    setStyle("Full Width");
    setFile(null);

    // Kalau nanti mau redirect:
    // window.location.href = "/memori";
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Memori Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Judul */}
        <div>
          <label className="font-semibold">Judul</label>
          <input
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul (opsional)"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="font-semibold">Deskripsi</label>
          <textarea
            className="border p-2 w-full rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi (opsional)"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="font-semibold">Kategori</label>
          <select
            className="border p-2 w-full rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Kegiatan">Kegiatan</option>
            <option value="Lomba">Lomba</option>
            <option value="Acara">Acara</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Style Foto */}
        <div>
          <label className="font-semibold">Style Foto</label>
          <select
            className="border p-2 w-full rounded"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="Full Width">Full Width</option>
            <option value="Square">Square</option>
            <option value="Landscape">Landscape</option>
          </select>
        </div>

        {/* Upload File */}
        <div>
          <label className="font-semibold">Pilih Foto</label>
          <input
            type="file"
            className="border p-2 w-full rounded"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white rounded ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Mengupload..." : "Upload Memori"}
        </button>
      </form>
    </div>
  );
}
