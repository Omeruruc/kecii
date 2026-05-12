import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGoatStore } from '../stores/goatStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const logout = useAuthStore(state => state.logout);
  const stats = useGoatStore(state => state.stats);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-amber-800">Sabri Kurban</h1>
          </div>
          
          {/* Desktop view */}
          <div className="hidden md:flex items-center justify-end space-x-8">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Toplam Ödenen</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(stats.totalPaid)}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Toplam Kalan</p>
                <p className="text-lg font-semibold text-amber-600">{formatCurrency(stats.totalRemaining)}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <LogOut size={16} className="mr-2" />
              Çıkış Yap
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-700 hover:text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <div className="px-4 py-2 flex justify-between">
              <span className="text-sm text-gray-500">Toplam Ödenen:</span>
              <span className="text-sm font-semibold text-green-600">{formatCurrency(stats.totalPaid)}</span>
            </div>
            <div className="px-4 py-2 flex justify-between">
              <span className="text-sm text-gray-500">Toplam Kalan:</span>
              <span className="text-sm font-semibold text-amber-600">{formatCurrency(stats.totalRemaining)}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-base font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              <div className="flex items-center">
                <LogOut size={16} className="mr-2" />
                Çıkış Yap
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;