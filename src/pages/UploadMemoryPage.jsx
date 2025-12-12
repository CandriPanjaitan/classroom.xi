import { useState } from "react";
import { uploadMemory } from "../utils/uploadMemory";

export default function UploadMemoryPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("square");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!files.length) {
      alert("Pilih file dulu!");
      return;
    }

    setLoading(true);

    const selectedFile = files[0];
    const result = await uploadMemory(selectedFile);

    setLoading(false);

    if (result.error) {
      console.error(result.error);
      alert("Gagal upload gambar");
      return;
    }

    console.log("URL Foto:", result.url);

    alert("Upload Berhasil!");
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Upload Memory</h1>

      {/* TITLE */}
      <label className="font-semibold">Judul Memory</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        placeholder="Judul foto..."
      />

      {/* DESCRIPTION */}
      <label className="font-semibold">Deskripsi</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        placeholder="Deskripsi foto..."
      />

      {/* CATEGORY */}
      <label className="font-semibold">Kategori</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      >
        <option value="">Pilih kategori</option>
        <option value="kegiatan">Kegiatan</option>
        <option value="kelas">Kelas</option>
        <option value="acara">Acara</option>
      </select>

      {/* STYLE */}
      <label className="font-semibold">Style Foto</label>
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      >
        <option value="square">Square</option>
        <option value="full">Full Width</option>
        <option value="portrait">Portrait</option>
      </select>

      {/* FILE UPLOAD */}
      <label className="font-semibold mt-4 block">Pilih Foto</label>
      <input
        type="file"
        onChange={(e) => setFiles(e.target.files)}
        className="w-full mb-4"
      />

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded mt-2"
      >
        {loading ? "Mengupload..." : "Upload Memory"}
      </button>
    </div>
  );
}
