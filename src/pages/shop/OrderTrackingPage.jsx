import React, { useState, useEffect } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const { orders, loading: ordersLoading } = useOrders();
  const { user } = useAuth();

  // User's own orders if logged in
  const userOrders = user ? orders.filter(order => order.customerInfo?.email === user.email) : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    // Find order in context
    const foundOrder = orders.find(o => o.id === orderId.trim());

    if (foundOrder) {
      setSearchResult(foundOrder);
    } else {
      setError('Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.');
    }
    setIsSearching(false);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Beklemede', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock, description: 'Siparişiniz alındı ve onay bekliyor.' },
      processing: { label: 'Hazırlanıyor', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: Package, description: 'Siparişiniz paketleniyor.' },
      shipped: { label: 'Kargoda', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: Truck, description: 'Siparişiniz kargoya verildi.' },
      delivered: { label: 'Teslim Edildi', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle, description: 'Siparişiniz size ulaştı.' },
      cancelled: { label: 'İptal Edildi', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle, description: 'Siparişiniz iptal edildi.' }
    };
    return configs[status] || configs.pending;
  };

  const OrderCard = ({ order }) => {
    const config = getStatusConfig(order.status);
    const StatusIcon = config.icon;

    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Sipariş No</span>
            <h3 className="text-lg font-black text-secondary-900">#{order.id}</h3>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${config.bgColor} ${config.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-bold">{config.label}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{config.label}</p>
              <p className="text-xs text-gray-500">{config.description}</p>
            </div>
          </div>

          {(order.trackingNumber || order.carrier) && (
            <div className="p-4 border border-primary/10 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Truck className="w-4 h-4" />
                <span className="text-sm font-bold">Kargo Bilgileri</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Kargo Firması</p>
                  <p className="text-sm font-bold text-secondary-800">{order.carrier || 'Belirtilmedi'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Takip Numarası</p>
                  <p className="text-sm font-bold text-secondary-800">{order.trackingNumber || 'Henüz Girilmedi'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="text-lg font-black text-primary">
            ₺{order.total?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-secondary-900 uppercase tracking-tighter mb-4">
            Sipariş <span className="text-primary">Takibi</span>
          </h1>
          <p className="text-gray-500 font-medium">Siparişinizin durumunu anlık olarak buradan takip edebilirsiniz.</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 bg-gray-50 rounded-2xl flex items-center px-4 md:px-5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="text-gray-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Sipariş No (Örn: #12345)"
                className="w-full pl-3 md:pl-5 pr-2 py-4 bg-transparent border-none focus:ring-0 text-secondary-900 font-bold placeholder:text-gray-400 text-sm md:text-base outline-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-primary hover:bg-primary-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSearching ? 'Sorgulanıyor...' : 'Sorgula'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {searchResult && (
            <div className="mt-10 animate-fade-in">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Sorgu Sonucu</h4>
              <OrderCard order={searchResult} />
            </div>
          )}
        </div>

        {/* Logged in User Orders */}
        {user && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-xl font-black text-secondary-900 uppercase tracking-tight">Siparişlerim</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">{userOrders.length} SİPARİŞ</span>
            </div>

            {ordersLoading ? (
              <div className="text-center py-12 text-gray-400 font-bold">Siparişleriniz yükleniyor...</div>
            ) : userOrders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold mb-6">Henüz bir siparişiniz bulunmuyor.</p>
                <Link to="/urunler" className="inline-flex items-center gap-2 text-primary font-black uppercase text-sm hover:gap-3 transition-all">
                  Alışverişe Başla <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-20 p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center">
          <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-black text-secondary-900 uppercase tracking-tight mb-2">Desteğe mi İhtiyacınız Var?</h3>
          <p className="text-gray-500 mb-6 font-medium">Siparişinizle ilgili bir sorun mu yaşıyorsunuz? WhatsApp destek hattımızdan bize ulaşabilirsiniz.</p>
          <a 
            href="https://wa.me/905555555555" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-green-200"
          >
            <MessageCircle className="w-5 h-5" />
            WHATSAPP DESTEK HATTI
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
