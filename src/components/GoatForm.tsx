import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useGoatStore } from '../stores/goatStore';
import { Goat } from '../lib/supabase';
import { X } from 'lucide-react';

interface GoatFormProps {
  goat?: Goat;
  onClose: () => void;
  isEdit?: boolean;
}

const GoatForm: React.FC<GoatFormProps> = ({ goat, onClose, isEdit = false }) => {
  const addGoat = useGoatStore(state => state.addGoat);
  const updateGoat = useGoatStore(state => state.updateGoat);
  
  const [ownerName, setOwnerName] = useState('');
  const [price, setPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>('unpaid');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (goat && isEdit) {
      setOwnerName(goat.owner_name);
      setPrice(goat.price.toString());
      setPaymentStatus(goat.payment_status);
      setPaidAmount(goat.paid_amount.toString());
      setNotes(goat.notes || '');
    }
  }, [goat, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const priceNum = parseFloat(price);
    const paidAmountNum = parseFloat(paidAmount) || 0;
    
    if (priceNum <= 0) {
      toast.error('Lütfen geçerli bir fiyat girin');
      return;
    }
    
    if (paidAmountNum > priceNum) {
      toast.error('Ödenen miktar, toplam fiyattan büyük olamaz');
      return;
    }
    
    // Automatically determine payment status based on paid amount
    let calculatedStatus: 'paid' | 'partial' | 'unpaid';
    if (paidAmountNum === 0) {
      calculatedStatus = 'unpaid';
    } else if (paidAmountNum === priceNum) {
      calculatedStatus = 'paid';
    } else {
      calculatedStatus = 'partial';
    }
    
    setIsSubmitting(true);
    
    try {
      const goatData = {
        owner_name: ownerName,
        price: priceNum,
        payment_status: calculatedStatus,
        paid_amount: paidAmountNum,
        remaining_amount: priceNum - paidAmountNum,
        notes: notes
      };
      
      if (isEdit && goat) {
        await updateGoat(goat.id, goatData);
        toast.success('Keçi kaydı güncellendi');
      } else {
        await addGoat(goatData);
        toast.success('Yeni keçi kaydı eklendi');
      }
      
      onClose();
    } catch (error) {
      toast.error('Bir hata oluştu');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? 'Keçi Kaydını Düzenle' : 'Yeni Keçi Kaydı Ekle'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
              Keçi Sahibi
            </label>
            <input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Keçi Fiyatı (₺)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Ödenen Miktar (₺)
            </label>
            <input
              id="paidAmount"
              type="number"
              min="0"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Ödenen miktar fiyattan küçükse, kalan miktar otomatik olarak hesaplanacaktır.
            </p>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notlar (İsteğe Bağlı)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting
                  ? 'bg-amber-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
              }`}
            >
              {isSubmitting
                ? (isEdit ? 'Güncelleniyor...' : 'Ekleniyor...')
                : (isEdit ? 'Güncelle' : 'Ekle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoatForm;