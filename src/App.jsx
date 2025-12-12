// File: src/App.jsx

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// COMPONENTS
import Header from "./components/header";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC PAGES
import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import MemoriesPage from "./pages/MemoriesPage";


// PUBLIC PLACEHOLDER PAGES
const AboutPage = () => (
  <div className="p-8 text-center text-2xl">Ini adalah halaman Tentang Kelas.</div>
);
const StructurePage = () => (
  <div className="p-8 text-center text-2xl">Struktur Organisasi Kelas.</div>
);

// ADMIN PAGES
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import StudentsCRUDPage from "./pages/StudentsCRUDPage";
import UploadMemoryPage from "./pages/UploadMemoryPage";
import MemoriesCRUDPage from "./pages/MemoriesCRUDPage"; // 🟢 TAMBAHAN BARU

function App() {
  const location = useLocation();

  // cek apakah halaman admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header hanya untuk halaman publik */}
      {!isAdminRoute && <Header />}

      <main className={!isAdminRoute ? "container mx-auto py-8" : ""}>
        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/struktur" element={<StructurePage />} />
          <Route path="/siswa" element={<StudentsPage />} />
          <Route path="/memori" element={<MemoriesPage />} />

          {/* ---------- ADMIN LOGIN (TIDAK TERPROTEKSI) ---------- */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ---------- ADMIN ROUTES (TERPROTEKSI) ---------- */}
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

          {/* 🟢 HALAMAN UPLOAD MEMORY */}
          <Route
            path="/admin/upload-memory"
            element={
              <ProtectedRoute>
                <UploadMemoryPage />
              </ProtectedRoute>
            }
          />

          {/* 🟢 HALAMAN MEMORIES CRUD BARU */}
          <Route
            path="/admin/memories-crud"
            element={
              <ProtectedRoute>
                <MemoriesCRUDPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
