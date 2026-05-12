import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search, PlusCircle } from 'lucide-react';
import { useGoatStore } from '../stores/goatStore';
import GoatCard from './GoatCard';
import GoatForm from './GoatForm';
import { Goat } from '../lib/supabase';

const GoatList = () => {
  const { goats, deleteGoat, isLoading } = useGoatStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editGoat, setEditGoat] = useState<Goat | null>(null);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Bu keçi kaydını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteGoat(id);
        toast.success('Keçi kaydı silindi');
      } catch (error) {
        toast.error('Silme işlemi başarısız oldu');
      }
    }
  };
  
  const handleEdit = (goat: Goat) => {
    setEditGoat(goat);
  };
  
  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditGoat(null);
  };
  
  const filteredGoats = goats.filter(goat => 
    goat.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (goat.notes && goat.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Keçi Kayıtları</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Keçi sahibi veya açıklama ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <PlusCircle size={18} className="mr-2" />
            Yeni Keçi Ekle
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : filteredGoats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoats.map(goat => (
            <GoatCard
              key={goat.id}
              goat={goat}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'Arama sonuçlarına uygun keçi kaydı bulunamadı.' : 'Henüz keçi kaydı bulunmuyor.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-amber-600 hover:text-amber-700"
            >
              Aramayı temizle
            </button>
          )}
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <PlusCircle size={18} className="mr-2" />
              İlk Keçi Kaydını Ekle
            </button>
          )}
        </div>
      )}
      
      {(showAddForm || editGoat) && (
        <GoatForm
          goat={editGoat || undefined}
          onClose={handleCloseForm}
          isEdit={!!editGoat}
        />
      )}
    </div>
  );
};

export default GoatList;