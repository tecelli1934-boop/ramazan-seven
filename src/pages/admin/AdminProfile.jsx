import React, { useState } from 'react';
import { User, Mail, Lock, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { auth } from '../../firebase';

const AdminProfile = () => {
  const { user, updateUserData } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Kullanıcı oturumu bulunamadı.");

      let isUpdated = false;

      // 1. İsim Güncelleme
      if (name !== user.name) {
        await updateProfile(currentUser, { displayName: name });
        await updateUserData({ name }); // Firestore'u güncelle
        isUpdated = true;
      }

      // 2. E-posta Güncelleme
      if (email !== user.email) {
        await updateEmail(currentUser, email);
        await updateUserData({ email }); // Firestore'u güncelle
        isUpdated = true;
      }

      // 3. Şifre Güncelleme
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Şifreler eşleşmiyor!");
        }
        if (newPassword.length < 6) {
          throw new Error("Şifre en az 6 karakter olmalıdır.");
        }
        await updatePassword(currentUser, newPassword);
        setNewPassword('');
        setConfirmPassword('');
        isUpdated = true;
      }

      if (isUpdated) {
        showMessage('success', 'Profil bilgileriniz başarıyla güncellendi!');
      } else {
        showMessage('info', 'Herhangi bir değişiklik yapmadınız.');
      }

    } catch (error) {
      console.error("Güncelleme hatası:", error);
      
      // Güvenlik nedeniyle yeniden giriş yapılması gereken durum
      if (error.code === 'auth/requires-recent-login') {
        showMessage('error', 'Güvenlik nedeniyle bu işlemi yapabilmek için siteden çıkış yapıp tekrar giriş yapmanız gerekmektedir.');
      } else {
        showMessage('error', error.message || 'Güncelleme sırasında bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-800">Profil Ayarları</h2>
          <p className="text-secondary-600 text-sm mt-1">Yönetici hesap bilgilerinizi bu sayfadan güncelleyebilirsiniz.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" /> : 
             message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : 
             <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          
          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-primary focus:border-primary text-gray-800 bg-gray-50 focus:bg-white transition-colors"
                placeholder="Adınız Soyadınız"
              />
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-primary focus:border-primary text-gray-800 bg-gray-50 focus:bg-white transition-colors"
                placeholder="E-posta adresiniz"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Not: E-posta adresinizi değiştirmek için yakın zamanda giriş yapmış olmanız gerekir.</p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Şifre Değiştir
            </h3>
            <p className="text-xs text-gray-500 mb-4">Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakın.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-primary focus:border-primary text-gray-800 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="En az 6 karakter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-primary focus:border-primary text-gray-800 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Şifrenizi tekrar girin"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-bold text-white transition-all shadow-md uppercase tracking-wider text-sm flex justify-center items-center gap-2 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-600 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
              {loading ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
