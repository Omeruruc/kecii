import React, { useEffect } from 'react';
import { Layers, DollarSign, AlertTriangle } from 'lucide-react';
import Header from './Header';
import GoatList from './GoatList';
import { useGoatStore } from '../stores/goatStore';

const Dashboard = () => {
  const { fetchGoats, stats, isLoading } = useGoatStore();
  
  useEffect(() => {
    fetchGoats();
  }, [fetchGoats]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Layers className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Keçi Sayısı</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {isLoading ? '...' : stats.totalGoats}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Ödenen</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {isLoading ? '...' : formatCurrency(stats.totalPaid)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Kalan</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {isLoading ? '...' : formatCurrency(stats.totalRemaining)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <GoatList />
    </div>
  );
};

export default Dashboard;