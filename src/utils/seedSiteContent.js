import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const seedSiteContent = async () => {
  const pages = [
    {
      id: 'privacy',
      title: 'Gizlilik ve Kişisel Verilerin Korunması',
      content: `1. Veri Sorumlusu\nYapıMalzemesi olarak, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz...\n\n2. Kişisel Verilerin Toplanma Yöntemi\nKişisel verileriniz, internet sitemiz üzerinden yapılan alışverişler aracılığıyla toplanmaktadır...`
    },
    {
      id: 'sales',
      title: 'Mesafeli Satış Sözleşmesi',
      content: `1. Taraflar\nSatıcı: YapıMalzemesi - Ramazan Seven\nAlıcı: Siteden alışveriş yapan müşteri...\n\n2. Sözleşmenin Konusu\nBu sözleşmenin konusu, elektronik ortamda siparişini yaptığı ürünün satışı ve teslimidir.`
    },
    {
      id: 'return',
      title: 'İade ve İptal Koşulları',
      content: `İade süresi ürünün teslimatından itibaren 14 gündür. İade edilecek ürünün orijinal ambalajı hasar görmemiş olmalıdır.`
    },
    {
      id: 'about',
      title: 'YAPIDA TECRÜBE VE GÜVEN',
      content: `SVN PROFİL ARMATÜR olarak, yapı malzemeleri sektöründe kaliteli ve uzun ömürlü çözümler sunmak amacıyla yola çıktık. Bugün gelinen noktada, binlerce konut ve iş merkezi projesinde imzamızın bulunmasının gururunu yaşıyoruz.\n\nÖzellikle profil grupları ve armatür çözümlerinde uzmanlaşan ekibimiz, modern tasarım anlayışını yüksek mühendislik kalitesiyle birleştirerek projelerinize değer katmaktadır.`
    },
    {
      id: 'contact',
      title: 'İletişim Bilgileri',
      address: 'Ankara Sanayi Sitesi, No: 123 Ankara',
      phone: '+90 312 000 00 00',
      mobile: '+90 5XX XXX XX XX',
      email: 'info@ramazanseven.com',
      workingHours: 'Hafta İçi: 09:00 - 19:00 | C.tesi: 09:00 - 15:00'
    }
  ];

  for (const page of pages) {
    const docRef = doc(db, 'site_content', page.id);
    const docSnap = await getDoc(docRef);
    
    // Eğer döküman yoksa oluştur
    if (!docSnap.exists()) {
      await setDoc(docRef, page);
      console.log(`${page.id} dökümanı oluşturuldu.`);
    }
  }
};
