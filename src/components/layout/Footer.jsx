import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUp, MessageCircle } from 'lucide-react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    address: 'Saray Mahallesi, Ankara',
    phone: '+90 555 555 55 55',
    email: 'info@yapibahce.com'
  });

  useEffect(() => {
    const docRef = doc(db, 'site_content', 'contact');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContactInfo(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto">
      {/* Newsletter / Campaign Strip */}
      <div className="bg-[#111] text-white py-12 border-b border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Kampanyalardan Haberdar Olun!</h3>
            <p className="text-sm text-gray-400 font-medium">Yeni gelen ürünler ve özel indirimler için e-bültenimize kaydolun.</p>
          </div>
          <div className="flex w-full max-w-md bg-white/5 p-1.5 rounded-full border border-white/10 group focus-within:border-primary transition-all">
            <input 
              type="email" 
              placeholder="E-posta adresinizi yazın..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-white pl-6 text-sm !shadow-none"
            />
            <button className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20">
              KAYDET
            </button>
          </div>
        </div>
      </div>

      {/* Social Network Section */}
      <div className="bg-[#111] py-4 border-b border-white/5">
        <div className="container mx-auto px-4 flex justify-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
            <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
            <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
            <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
            <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </a>
          <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
            <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Corporate Info */}
            <div className="space-y-6">
              <span className="text-2xl font-black text-primary tracking-tighter block uppercase">
                SVN PROFİL <span className="text-gray-900">ARMATÜR</span>
              </span>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Profil ve armatür çözümlerinden yapı malzemelerine kadar geniş ürün yelpazemizle projelerinizde yanınızdayız.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-secondary-700">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold">{contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-secondary-700">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold">{contactInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Shopping Helper */}
            <div>
              <h4 className="text-lg font-black text-secondary-800 mb-8 uppercase tracking-tighter">Müşteri Hizmetleri</h4>
              <ul className="space-y-4">
                <li><Link to="/siparis-takip" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">Sipariş Takibi</Link></li>
                <li><Link to="/yardim" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">Yardım & Destek</Link></li>
                <li><Link to="/iletisim" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">Bize Ulaşın</Link></li>
                <li><Link to="/sikca-sorulan-sorular" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">S.S.S.</Link></li>
              </ul>
            </div>

            {/* Quick Pages */}
            <div>
              <h4 className="text-lg font-black text-secondary-800 mb-8 uppercase tracking-tighter">Kurumsal</h4>
              <ul className="space-y-4">
                <li><Link to="/bizi-taniyin" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">Hakkımızda</Link></li>
                <li><Link to="/gizlilik-politikasi" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">Gizlilik Politikası</Link></li>
                <li><Link to="/mesafeli-satis-sozlesmesi" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">Satış Sözleşmesi</Link></li>
                <li><Link to="/iade-kosullari" className="text-gray-500 hover:text-primary transition-colors text-sm font-bold">İade ve İptal</Link></li>
              </ul>
            </div>

            {/* Google Maps / Location Placeholder */}
            <div className="space-y-6">
              <h4 className="text-lg font-black text-secondary-800 mb-8 uppercase tracking-tighter">İletişim Bilgileri</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{contactInfo.address}</p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={scrollToTop}
                  className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all group"
                >
                  <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
              &copy; {new Date().getFullYear()} SVN PROFİL ARMATÜR. Tüm hakları saklıdır.
            </div>
            
            {/* Payment Methods Placeholder */}
            <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
