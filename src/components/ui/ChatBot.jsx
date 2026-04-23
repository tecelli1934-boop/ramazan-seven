import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';

// ─── Yanıt Motoru ────────────────────────────────────────────────────────────
const getBotResponse = (message) => {
  const msg = message.toLocaleLowerCase('tr-TR').trim();

  // Hızlı yanıt butonları (tam eşleşme)
  if (msg === 'ürün kategorileri' || msg === 'kategoriler' || msg.includes('kategori listesi')) {
    return {
      text: 'Sitemizdeki ana ürün kategorilerimiz şunlardır: 🔩',
      bullets: [
        '🚪 Kapı & Pencere Aksesuarları',
        '🟦 PVC Grubu',
        '🔨 Demir Hırdavat',
        '🔩 Vida Çeşitleri',
        '🏗️ İnşaat Malzemeleri',
        '👉 Üst menüden ilgilendiğiniz kategoriye tıklayabilirsiniz'
      ]
    };
  }

  // Sipariş takibi
  if (msg.includes('sipariş') && (msg.includes('takip') || msg.includes('nerede') || msg.includes('sorgula'))) {
    return {
      text: 'Siparişinizi kolayca takip edebilirsiniz! 📦',
      bullets: [
        'Sağ üstteki **Sipariş Takibi** menüsüne tıklayın',
        'Sipariş numaranızı girerek durumunuzu sorgulayın',
        'Ya da hesabınıza giriş yaparak tüm siparişlerinizi görün'
      ]
    };
  }

  // Fiyat sorusu
  if (msg.includes('fiyat') || msg.includes('ücret') || msg.includes('kaç') || msg.includes('ne kadar') || msg.includes('teklif')) {
    return {
      text: 'Güncel fiyat ve teklif bilgisi için temsilcimize ulaşabilirsiniz 🤝',
      bullets: [
        '📞 Telefon: +90 555 555 55 55',
        '💬 İletişim formunu doldurun',
        'WhatsApp üzerinden de yazabilirsiniz'
      ]
    };
  }

  // Stok sorusu
  if (msg.includes('stok') || msg.includes('var mı') || msg.includes('mevcut') || msg.includes('temin')) {
    return {
      text: 'Güncel stok durumu için lütfen temsilcimizle iletişime geçin:',
      bullets: [
        '📞 +90 555 555 55 55',
        '🌐 Sitemizin iletişim formunu doldurun',
        'En kısa sürede dönüş yapılacaktır'
      ]
    };
  }

  // Kapı & Pencere
  if (msg.includes('kapı') || msg.includes('pencere') || msg.includes('menteşe') || msg.includes('kol') || msg.includes('kilit')) {
    return {
      text: 'Kapı & Pencere Aksesuarları kategorimizde birçok ürün bulunuyor! 🚪',
      bullets: [
        'Menteşe çeşitleri',
        'Kapı kolları ve kilitleri',
        'Pencere mekanizmaları',
        'Pimapen & sürme sistemi aksesuarları',
        '👉 Üst menüden **Kapı & Pencere Aksesuar** kategorisine göz atın'
      ]
    };
  }

  // PVC
  if (msg.includes('pvc') || msg.includes('plastik') || msg.includes('profil')) {
    return {
      text: 'PVC Grubu kategorimize hoş geldiniz! 🏗️',
      bullets: [
        'PVC profil çeşitleri',
        'PVC bağlantı elemanları',
        'Yalıtım ve conta ürünleri',
        '👉 Üst menüden **PVC Grubu** kategorisini inceleyin'
      ]
    };
  }

  // Vida
  if (msg.includes('vida') || msg.includes('civata') || msg.includes('somun') || msg.includes('dübel')) {
    return {
      text: 'Vida Çeşitleri kategorimizde geniş bir ürün yelpazemiz var! 🔩',
      bullets: [
        'Her boyut ve türde vida',
        'Civata ve somun setleri',
        'Dübel çeşitleri',
        'Özel vida türleri',
        '👉 Üst menüden **Vida Çeşitleri** kategorisine bakın'
      ]
    };
  }

  // Demir / Hırdavat
  if (msg.includes('demir') || msg.includes('hırdavat') || msg.includes('çivi') || msg.includes('tel') || msg.includes('boru')) {
    return {
      text: 'Demir Hırdavat kategorimizde kaliteli ürünler sizi bekliyor! 🔨',
      bullets: [
        'Çivi ve tel çeşitleri',
        'Demir profil ve borular',
        'Bağlantı elemanları',
        '👉 Üst menüden **Demir Hırdavat** kategorisine göz atın'
      ]
    };
  }

  // İnşaat malzemeleri
  if (msg.includes('inşaat') || msg.includes('yapı') || msg.includes('beton') || msg.includes('çimento') || msg.includes('malzeme')) {
    return {
      text: 'İnşaat Malzemeleri kategorimizi inceleyebilirsiniz! 🏠',
      bullets: [
        'Yapı kimyasalları',
        'İnşaat aksesuarları',
        'Çeşitli yapı malzemeleri',
        '👉 Üst menüden **İnşaat Malzemeleri** kategorisine bakın'
      ]
    };
  }

  // İletişim
  if (msg.includes('iletişim') || msg.includes('ulaş') || msg.includes('telefon') || msg.includes('adres') || msg.includes('nerede')) {
    return {
      text: 'Bize birçok kanaldan ulaşabilirsiniz 📬',
      bullets: [
        '📞 +90 555 555 55 55',
        '🌐 Sitemizin **İletişim** sayfasını ziyaret edin',
        '💬 WhatsApp üzerinden yazabilirsiniz',
        '🕐 Hafta içi 09:00–19:00 | Cumartesi 09:00–15:00'
      ]
    };
  }

  // Hakkımızda / bizi tanıyın
  if (msg.includes('hakkında') || msg.includes('tanı') || msg.includes('kimsiniz') || msg.includes('şirket') || msg.includes('firma')) {
    return {
      text: 'SVN Profil Armatür hakkında daha fazla bilgi almak için:',
      bullets: [
        '👉 **Bizi Tanıyın** sayfamızı ziyaret edin',
        'Yıllarca sektörde kaliteli hizmet veriyoruz',
        'Güven ve kalite önceliğimizdir'
      ]
    };
  }

  // Teşekkür
  if (msg.includes('teşekkür') || msg.includes('sağ ol') || msg.includes('eyvallah') || msg.includes('tamam')) {
    return {
      text: 'Rica ederim! 😊 Başka bir konuda yardımcı olabilir miyim?',
      bullets: []
    };
  }

  // Selamlama
  if (msg.includes('merhaba') || msg.includes('selam') || msg.includes('iyi günler') || msg.includes('iyi akşam') || msg.includes('hey')) {
    return {
      text: 'Merhaba! SVN Profil Armatür\'e hoş geldiniz 👋',
      bullets: [
        'Size nasıl yardımcı olabilirim?',
        '🔩 Ürün ve kategori bilgisi',
        '📦 Sipariş takibi',
        '📞 İletişim ve destek'
      ]
    };
  }

  // Konu dışı
  const offTopicKeywords = ['siyaset', 'futbol', 'hava durumu', 'müzik', 'film', 'oyun', 'tarih', 'matematik'];
  if (offTopicKeywords.some(k => msg.includes(k))) {
    return {
      text: 'Bu konuda yardımcı olamıyorum 😊 Ama yapı malzemeleri, ürünlerimiz veya siparişleriniz hakkında her türlü sorunuzu yanıtlamaktan mutluluk duyarım!',
      bullets: []
    };
  }

  // Varsayılan
  return {
    text: 'Sorunuzu tam anlayamadım. Size şu konularda yardımcı olabilirim:',
    bullets: [
      '🔩 Ürün kategorileri (Vida, Kapı/Pencere, PVC, Demir Hırdavat…)',
      '📦 Sipariş takibi',
      '💰 Fiyat ve teklif bilgisi',
      '📞 İletişim ve destek',
      'Veya **+90 555 555 55 55** arayabilirsiniz'
    ]
  };
};

// ─── Mesaj Bileşeni ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isBot = msg.role === 'bot';

  const formatText = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] ${isBot ? '' : 'order-first'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? 'bg-gray-100 text-gray-800 rounded-tl-none'
              : 'bg-primary text-white rounded-tr-none'
          }`}
        >
          <p dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
          {msg.bullets && msg.bullets.length > 0 && (
            <ul className="mt-2 space-y-1">
              {msg.bullets.map((b, i) => (
                <li
                  key={i}
                  className={`text-xs ${isBot ? 'text-gray-600' : 'text-white/90'}`}
                  dangerouslySetInnerHTML={{ __html: '• ' + formatText(b) }}
                />
              ))}
            </ul>
          )}
        </div>
        <p className={`text-[10px] text-gray-400 mt-1 ${isBot ? 'ml-1' : 'text-right mr-1'}`}>
          {msg.time}
        </p>
      </div>
      {!isBot && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  );
};

// ─── Ana ChatBot Bileşeni ─────────────────────────────────────────────────────
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Merhaba! SVN Profil Armatür\'e hoş geldiniz 👋',
      bullets: [
        'Ürün ve kategori bilgisi',
        'Sipariş takibi',
        'Fiyat ve teklif',
        'İletişim ve destek',
        'konularında size yardımcı olabilirim!'
      ],
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const now = () =>
    new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: 'user', text, bullets: [], time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', ...response, time: now() }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = ['Ürün Kategorileri', 'Sipariş Takibi', 'Fiyat Bilgisi', 'İletişim'];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[340px] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl z-[999] flex flex-col overflow-hidden border border-gray-100 animate-slide-up">
          {/* Header */}
          <div className="bg-primary px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-sm">SVN Asistan</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-white/80 text-[11px]">Çevrimiçi</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 custom-scrollbar">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center mb-3">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto flex-shrink-0 custom-scrollbar">
            {quickReplies.map((q) => (
              <button
                key={q}
              onClick={() => {
                  const text = q;
                  const userMsg = { role: 'user', text, bullets: [], time: now() };
                  setMessages((prev) => [...prev, userMsg]);
                  setIsTyping(true);
                  setTimeout(() => {
                    const response = getBotResponse(text);
                    setMessages((prev) => [...prev, { role: 'bot', ...response, time: now() }]);
                    setIsTyping(false);
                  }, 700);
                }}
                className="flex-shrink-0 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[11px] font-bold hover:bg-primary hover:text-white transition whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesajınızı yazın..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center hover:bg-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110 active:scale-95 z-[999]"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </>
  );
};

export default ChatBot;
