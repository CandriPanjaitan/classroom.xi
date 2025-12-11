import React from 'react';
import { Link } from 'react-router-dom'; // <-- PASTIKAN BARIS INI ADA!

const HomePage = () => {
    return ( // <-- PASTIKAN RETURN INI ADA!
        // Wrapper yang mengisi hampir seluruh layar (min-h-[80vh])
        <div className="flex items-center justify-center p-4 sm:p-8">
            {/* ... semua konten hero section lainnya ... */}
            
            {/* Pastikan Link digunakan dengan benar */}
            <Link 
                to="/siswa"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
                Kenali Semua Siswa Kami
            </Link>
        </div>
    );
};

export default HomePage;