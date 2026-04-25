import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const WhatsAppButton = () => {
  const [contactInfo, setContactInfo] = useState({ phone: '+90 555 555 55 55', mobile: '+90 555 555 55 55' });

  useEffect(() => {
    const docRef = doc(db, 'site_content', 'contact');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContactInfo(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const phoneNumber = contactInfo.mobile || contactInfo.phone || '+905555555555';
  const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-[9999] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group animate-bounce-subtle"
      aria-label="WhatsApp ile İletişime Geç"
    >
      <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      <span className="absolute right-full mr-4 px-4 py-2 bg-white text-gray-800 text-sm font-bold rounded-xl shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap hidden md:block border border-gray-100">
        Müşteri Hizmetleri
      </span>
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10"></span>
    </a>
  );
};

export default WhatsAppButton;
