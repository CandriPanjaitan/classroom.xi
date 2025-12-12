// File: src/pages/AdminDashboardPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from "../utils/supabaseClient";

const AdminDashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error.message);
            alert("Gagal logout. Coba lagi.");
        } else {
            // Arahkan kembali ke halaman login setelah logout
            navigate('/admin/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-10 pb-4 border-b-2 border-blue-200">
                <h1 className="text-4xl font-extrabold text-blue-700">Admin Dashboard Kelas XI</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                >
                    Logout
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 1. CRUD Siswa - LINK YANG SUDAH DIUPDATE */}
                <Link to="/admin/students-crud" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Kelola Siswa</h2>
                    <p className="text-gray-600">Tambah, Edit, Hapus data dan foto siswa (A-Z).</p>
                </Link>

                {/* 2. CRUD Memori (placeholder) */}
                <Link to="/admin/memories-crud" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-yellow-500">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Kelola Memori</h2>
                    <p className="text-gray-600">Tambah, Edit, Hapus foto kenangan dan atur tampilan.</p>
                </Link>

                {/* 3. CRUD Struktur (placeholder) */}
                <Link to="/admin/structure-crud" className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-purple-500">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Kelola Struktur</h2>
                    <p className="text-gray-600">Edit data Wali Kelas, Ketua, Sekretaris, dan Bendahara.</p>
                </Link>

            </div>
        </div>
    );
};

export default AdminDashboardPage;