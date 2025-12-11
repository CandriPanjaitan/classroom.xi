import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

const bucketName = "class-photos";

const StudentsCRUDPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // FUNGSI FETCH STUDENTS (Harus dideklarasikan di sini agar bisa diakses di useEffect, onSubmit, dan handleDelete)
  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error);
      setMessage("Gagal memuat data siswa.");
    } else {
      setStudents(data);
    }
    setLoading(false);
  };

  // PEMANGGILAN DENGAN useEffect
  useEffect(() => {
    Promise.resolve().then(() => {
        fetchStudents();
    });
  }, []);

  const onSubmit = async (data) => {
    if (uploading) return;

    let photoUrl = data.photo_url_existing || "";
    const photoFile = data.photo_file && data.photo_file[0];

    if (photoFile) {
      setUploading(true);

      const fileName = `${v4()}-${photoFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, photoFile);

      setUploading(false);

      if (uploadError) {
        setMessage(`Gagal upload foto: ${uploadError.message}`);
        return;
      }

      photoUrl = `${
        supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl
      }`;

      if (
        isEditing &&
        currentStudent.photo_url &&
        currentStudent.photo_url.includes(bucketName)
      ) {
        const filePath = currentStudent.photo_url.split(`${bucketName}/`)[1];
        await supabase.storage.from(bucketName).remove([filePath]);
      }
    }

    const studentData = {
      name: data.name,
      photo_url: photoUrl,
      social_media: data.social_media || null,
      whatsapp_number: data.whatsapp_number || null,
      seat_number: parseInt(data.seat_number),
    };

    let finalError;
    if (isEditing) {
      const { error } = await supabase
        .from("students")
        .update(studentData)
        .eq("id", currentStudent.id);
      finalError = error;
    } else {
      const { error } = await supabase.from("students").insert([studentData]);
      finalError = error;
    }

    if (finalError) {
      setMessage(`Gagal menyimpan data: ${finalError.message}`);
    } else {
      setMessage(
        `Data siswa berhasil ${isEditing ? "diperbarui" : "ditambahkan"}!`
      );
      resetForm();
      fetchStudents();
    }
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    reset({
      name: student.name,
      social_media: student.social_media,
      whatsapp_number: student.whatsapp_number,
      seat_number: student.seat_number,
      photo_url_existing: student.photo_url,
    });
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Yakin ingin menghapus ${student.name}?`)) return;

    if (student.photo_url && student.photo_url.includes(bucketName)) {
      const filePath = student.photo_url.split(`${bucketName}/`)[1];
      await supabase.storage.from(bucketName).remove([filePath]);
    }

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", student.id);

    if (error) {
      setMessage(`Gagal menghapus data: ${error.message}`);
    } else {
      setMessage(`${student.name} berhasil dihapus.`);
      fetchStudents();
    }
  };

  const resetForm = () => {
    reset();
    setIsEditing(false);
    setCurrentStudent(null);
    setMessage("");
  };

  if (loading)
    return (
      <div className="text-center p-8">Memuat data manajemen siswa...</div>
    );

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEditing
          ? `Edit Siswa: ${currentStudent?.name}`
          : "Tambah Siswa Baru"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-50 p-6 rounded-xl shadow-inner mb-10 border-l-4 border-blue-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nama Lengkap Siswa"
            {...register("name", { required: true })}
          />

          <input
            className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            type="number"
            placeholder="Nomor Bangku (misal: 12)"
            {...register("seat_number", {
              required: true,
              valueAsNumber: true,
            })}
          />
          <input
            className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Link Medsos/Instagram"
            {...register("social_media")}
          />
          <input
            className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nomor WhatsApp"
            {...register("whatsapp_number")}
          />
          <div className="md:col-span-2 border p-3 rounded-lg bg-white flex items-center">
            <label className="mr-4 text-gray-600">Foto Profil:</label>
            <input
              type="file"
              accept="image/*"
              {...register("photo_file")}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {isEditing && currentStudent?.photo_url && (
              <span className="text-sm text-green-600 ml-4">
                (Foto sudah ada, upload baru untuk mengganti)
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isEditing
              ? uploading
                ? "Mengganti Foto..."
                : "Perbarui Data"
              : uploading
              ? "Mengunggah..."
              : "Simpan Siswa"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>

      {message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            message.includes("Gagal")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Daftar Siswa (Total: {students.length})
      </h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bangku
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medsos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-blue-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={
                      student.photo_url ||
                      "https://via.placeholder.com/50?text=NF"
                    }
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.seat_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.social_media || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsCRUDPage;