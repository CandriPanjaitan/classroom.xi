import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import supabase from "../utils/supabaseClient";
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage('');

        // 1. Menggunakan Supabase Auth untuk Login
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setMessage(`Login Gagal: ${error.message}`);
            console.error(error);
        } else {
            setMessage('Login Berhasil! Mengarahkan ke Dashboard...');
            // 2. Arahkan ke halaman admin setelah login sukses
            navigate('/admin/dashboard'); 
        }

        setLoading(false);
    };

    return (
        // *************************************************************
        // PENTING: Struktur ini memastikan form muncul di tengah layar
        // *************************************************************
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-blue-600">Admin Login</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {message && (
                        <div className={`p-3 rounded ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email wajib diisi" })}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password wajib diisi" })}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;