import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';

// Hero Görselleri
import slide1 from '../../assets/hero/slide1.png';
import slide2 from '../../assets/hero/slide2.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: "YENİ SEZON KOLEKSİYONU",
      title: "YAPIDA PROFESYONEL ÇÖZÜMLER",
      description: "En kaliteli profil ve armatür çözümleriyle projelerinize değer katıyoruz.",
      image: slide1,
      btnText: "HEMEN ALIŞVERİŞE BAŞLA",
      link: "/urunler",
      theme: "dark"
    },
    {
      id: 2,
      tag: "ESTETİK & FONKSİYONEL",
      title: "ŞIK VE GÜÇLÜ ARMATÜRLER",
      description: "Modern tasarımlar ve kusursuz işçilikle banyolarınıza değer katın.",
      image: slide2,
      btnText: "KOLEKSİYONU İNCELE",
      link: "/koleksiyon",
      theme: "dark"
    },
    {
      id: 3,
      tag: "ENDÜSTRİYEL KALİTE",
      title: "DAYANIKLI PROFİL GRUPLARI",
      description: "Yüksek mukavemetli ve uzun ömürlü profil seçenekleri SVN kalitesiyle.",
      image: slide1,
      btnText: "TÜMÜNÜ GÖR",
      link: "/urunler",
      theme: "dark"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Otomatik geçiş ve manuel müdahale kontrolü
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, currentSlide]); // currentSlide eklenerek her değişimde timer sıfırlanır

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO 
        title="Ana Sayfa" 
        description="SVN PROFİL ARMATÜR - Profil ve armatür çözümlerinden yapı malzemelerine kadar profesyonel çözümler."
      />
      
      {/* Hero Section - Slider */}
      <section className="relative h-[550px] sm:h-[600px] md:h-[700px] bg-secondary-900 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                alt={slide.title}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${
                  index === currentSlide ? 'scale-110' : 'scale-100'
                }`}
                style={{ filter: 'brightness(0.5)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/60 to-transparent"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 h-full relative z-20 flex items-center">
              <div className={`max-w-3xl transform transition-all duration-700 delay-300 ${
                index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md shadow-lg">
                  {slide.tag}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.1] tracking-tighter uppercase italic drop-shadow-2xl">
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? 'text-primary not-italic' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <p className="text-base md:text-xl text-gray-200 mb-8 md:mb-10 max-w-2xl font-medium leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                  <Link
                    to={slide.link}
                    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-primary hover:bg-primary-600 text-white font-black rounded-xl transition-all hover:scale-105 shadow-2xl shadow-primary/40 text-[13px] md:text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 group"
                  >
                    {slide.btnText}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/bizi-taniyin"
                    className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 backdrop-blur-md text-[13px] md:text-[15px] uppercase tracking-widest text-center"
                  >
                    BİZİ TANIYIN
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 sm:px-4 md:px-8 pointer-events-none">
          <button
            onClick={prevSlide}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-primary text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 pointer-events-auto hover:scale-110 active:scale-90"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-primary text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 pointer-events-auto hover:scale-110 active:scale-90"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 transition-all duration-500 rounded-full shadow-lg ${
                i === currentSlide ? 'w-12 bg-primary' : 'w-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-medium transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-xl shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-secondary-800 text-sm uppercase tracking-tight">HIZLI TESLİMAT</h4>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">STOKTAN AYNI GÜN KARGO</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-medium transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-xl shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <RotateCcw className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-secondary-800 text-sm uppercase tracking-tight">KOLAY İADE</h4>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">14 GÜN İÇİNDE İADE İMKANI</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-medium transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-xl shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-secondary-800 text-sm uppercase tracking-tight">GÜVENLİ ÖDEME</h4>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">%100 GÜVENLİ ALIŞVERİŞ</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-medium transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-xl shadow-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-secondary-800 text-sm uppercase tracking-tight">7/24 DESTEK</h4>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">PROFESYONEL ÇÖZÜM MERKEZİ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories / Banner Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Banner */}
            <div className="flex-1 bg-secondary-900 rounded-[32px] overflow-hidden relative min-h-[400px] flex items-center group">
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-12 relative z-10 max-w-lg">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter uppercase">
                  PROJELERİNİZE <br />
                  <span className="text-primary italic">DEĞER KATIN</span>
                </h2>
                <p className="text-gray-400 mb-8 font-medium">En kaliteli profil ve armatür çözümleriyle her zaman yanınızdayız.</p>
                <Link 
                  to="/koleksiyon" 
                  className="inline-flex items-center gap-3 text-white font-black text-sm uppercase tracking-widest group"
                >
                  KOLEKSİYONU İNCELE 
                  <ChevronRight className="w-5 h-5 bg-primary rounded-full p-1 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Side Banners */}
            <div className="w-full md:w-1/3 flex flex-col gap-8">
              <div className="flex-1 bg-primary rounded-[32px] p-8 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform"></div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase leading-none">PROFESYONEL <br /> ARMATÜR GRUBU</h3>
                <Link to="/urunler" className="text-white/80 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">ŞİMDİ GÖR →</Link>
              </div>
              <div className="flex-1 bg-gray-100 rounded-[32px] p-8 flex flex-col justify-center group border border-gray-200">
                <h3 className="text-2xl font-black text-secondary-800 mb-4 tracking-tighter uppercase leading-none">DAYANIKLI <br /> PROFİL GRUBU</h3>
                <Link to="/urunler" className="text-primary font-bold text-xs uppercase tracking-widest transition-colors">TÜM ÜRÜNLER →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-secondary-900 mb-6 tracking-tighter uppercase italic">
            KALİTELİ MALZEME, <span className="text-primary not-italic">DOĞRU FİYAT</span>
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl mx-auto font-medium">30 yıllık tecrübemizle yapı malzemesi ve profil çözümlerinde en iyiyi sunuyoruz.</p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-1">30+</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">YIL TECRÜBE</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-1">5000+</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MUTLU MÜŞTERİ</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
