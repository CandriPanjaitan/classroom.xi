import { Link } from 'react-router-dom';

const Header = () => {
  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Struktur', path: '/struktur' },
    { name: 'Siswa', path: '/siswa' },
    { name: 'Memori', path: '/memori' },
  ];

  return (
    <header className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          Kelas XI
        </div>
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="text-white hover:text-yellow-300 transition duration-200 text-lg font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Anda bisa menambahkan tombol menu mobile di sini jika perlu */}
      </div>
    </header>
  );
};

export default Header;