import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Goat } from '../lib/supabase';

interface GoatCardProps {
  goat: Goat;
  onEdit: (goat: Goat) => void;
  onDelete: (id: string) => void;
}

const GoatCard: React.FC<GoatCardProps> = ({ goat, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  
  const getStatusBadge = () => {
    switch (goat.payment_status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Ödendi</span>;
      case 'partial':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">Kısmi Ödeme</span>;
      case 'unpaid':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Ödenmedi</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{goat.owner_name}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Fiyat:</span>
            <span className="font-medium">{formatCurrency(goat.price)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Ödenen:</span>
            <span className="font-medium text-green-600">{formatCurrency(goat.paid_amount)}</span>
          </div>
          
          {goat.payment_status !== 'paid' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Kalan:</span>
              <span className="font-medium text-amber-600">{formatCurrency(goat.remaining_amount)}</span>
            </div>
          )}
          
          {goat.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500 break-words">{goat.notes}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {formatDate(goat.created_at)}
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(goat)}
              className="p-1 text-gray-500 hover:text-amber-600 focus:outline-none"
              aria-label="Düzenle"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(goat.id)}
              className="p-1 text-gray-500 hover:text-red-600 focus:outline-none"
              aria-label="Sil"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoatCard;