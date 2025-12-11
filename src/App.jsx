// File: src/App.jsx

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// Menggunakan huruf kecil 'header' sesuai kebutuhan proyek Anda
import Header from './components/header'; 

// Import Halaman Publik
import StudentsPage from './pages/studentsPage';
import HomePage from './pages/HomePage'; // Halaman Beranda baru

// Import Halaman Admin dan Proteksi
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StudentsCRUDPage from './pages/StudentsCRUDPage'; // Halaman CRUD Siswa baru
import ProtectedRoute from './components/ProtectedRoute'; // Komponen Proteksi Keamanan

// --- KOMPONEN PLACEHOLDER PUBLIK LAINNYA ---
const AboutPage = () => <div className="p-8 text-center text-2xl">Ini adalah halaman Tentang Kelas.</div>;
const StructurePage = () => <div className="p-8 text-center text-2xl">Struktur Organisasi Kelas.</div>;
const MemoriesPage = () => <div className="p-8 text-center text-2xl">Kumpulan Foto Memori.</div>;
// ------------------------------------------

function App() {
  const location = useLocation(); 
  
  // Tentukan apakah rute saat ini adalah rute admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header hanya muncul di rute publik (bukan /admin) */}
      {!isAdminRoute && <Header />} 
      
      {/* Kontainer utama. Jika bukan Admin, gunakan container Tailwind. */}
      <main className={!isAdminRoute ? "container mx-auto py-8" : ""}>
        <Routes>
          
          {/* Rute Publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/struktur" element={<StructurePage />} />
          <Route path="/siswa" element={<StudentsPage />} /> 
          <Route path="/memori" element={<MemoriesPage />} />

          {/* Rute Admin Login (Tidak Terproteksi) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          {/* Rute Terproteksi (Hanya bisa diakses setelah login) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/students-crud" 
            element={
              <ProtectedRoute>
                <StudentsCRUDPage />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </main>
    </div>
  );
}

export default App;