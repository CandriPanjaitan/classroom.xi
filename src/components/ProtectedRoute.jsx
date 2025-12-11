// File: src/components/ProtectedRoute.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase/client'; 

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      // Periksa sesi pengguna saat ini
      const { data: { session }, error } = await supabase.auth.getSession();
      
      setSession(session);
      setLoading(false);
      
      if (error) {
        console.error("Error getting session:", error);
      }
    };

    getSession();

    // Langganan perubahan status auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Cleanup listener
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    // Tampilkan loading saat memeriksa sesi
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Memeriksa status login...
      </div>
    );
  }

  // Jika TIDAK ada sesi, arahkan ke halaman login
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // Jika ada sesi, tampilkan komponen anak (Dashboard/CRUD)
  return children;
};

export default ProtectedRoute;