import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client'; // Pastikan path ini benar!

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      // Pindahkan fungsi fetching dari App.jsx ke sini
      let { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true }); // Diurutkan A-Z sesuai permintaan Anda

      setLoading(false);

      if (error) {
        console.error('Error fetching students:', error);
        setError("Gagal mengambil data siswa dari database.");
      } else {
        // Hapus data:image/jpeg yang bermasalah untuk pengujian
        const cleanedData = data.map(student => ({
            ...student,
            // Jika photo_url terlihat bermasalah, ganti dengan placeholder sementara
            photo_url: student.photo_url && student.photo_url.startsWith('http') 
                        ? student.photo_url 
                        : "https://via.placeholder.com/150/CCCCCC/808080?text=NO+IMAGE" 
        }));
        setStudents(cleanedData);
      }
    }

    fetchStudents();
  }, []);

  if (loading) return <div className="p-8 text-center text-xl">Memuat data siswa...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Daftar Siswa Kelas Kami</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {students.map((student) => (
          // Kartu Siswa
          <div key={student.id} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 text-center">
            
            <img 
              src={student.photo_url} 
              alt={student.name} 
              // Aturan Tailwind CSS untuk gambar berbentuk kotak yang rapi
              className="w-32 h-32 object-cover rounded-full mx-auto mb-3 border-4 border-blue-200" 
            />
            
            <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
            <p className="text-sm text-gray-500">Bangku No: {student.seat_number}</p>
            {/* Tombol detail akan kita buat nanti */}
            <button className="mt-3 text-sm text-blue-500 hover:text-blue-700 font-medium">
                Lihat Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsPage;