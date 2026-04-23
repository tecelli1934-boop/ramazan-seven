import React from 'react';
import SEO from '../../components/common/SEO';
import { ShieldCheck, Target, Users, Award, CheckCircle2, Building2 } from 'lucide-react';
import slide1 from '../../assets/hero/slide1.png';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const stats = [
    { label: 'Yıllık Tecrübe', value: '30+', icon: Award },
    { label: 'Mutlu Müşteri', value: '5000+', icon: Users },
    { label: 'Proje Tamamlandı', value: '1200+', icon: Target },
    { label: 'Ürün Çeşidi', value: '850+', icon: Building2 },
  ];

  const values = [
    {
      title: "Kalite Odaklılık",
      description: "Ürettiğimiz ve tedarik ettiğimiz her üründe en yüksek kalite standartlarını baz alıyoruz.",
      icon: ShieldCheck
    },
    {
      title: "Müşteri Memnuniyeti",
      description: "Satış öncesi ve sonrası verdiğimiz destekle uzun süreli iş ortaklıkları kuruyoruz.",
      icon: CheckCircle2
    },
    {
      title: "Sürekli İnovasyon",
      description: "Yapı sektöründeki gelişmeleri yakından takip ederek ürün portföyümüzü sürekli güncelliyoruz.",
      icon: Target
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="Bizi Tanıyın | SVN PROFİL ARMATÜR" 
        description="30 yıllık tecrübemizle yapı sektöründe profil ve armatür çözümleri sunuyoruz. Vizyonumuz ve değerlerimiz hakkında daha fazla bilgi edinin."
      />

      {/* Hero Section */}
      <section className="relative py-24 mb-12 overflow-hidden bg-secondary-900">
        <div className="absolute inset-0 opacity-20">
          <img src={slide1} alt="Bizi Tanıyın" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            KURUMSAL PROFiLİMİZ
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter italic leading-tight">
            YAPIDA <span className="text-primary not-italic">TECRÜBE VE GÜVEN</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto font-medium text-lg">
            Sektördeki 30 yılı aşkın deneyimimizle, estetiği ve dayanıklılığı bir araya getiren çözümler üretiyoruz.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-black text-secondary-900 uppercase tracking-tight">
                  Hakkımızda
                </h2>
                <div className="w-20 h-2 bg-primary rounded-full mb-8"></div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  SVN PROFİL ARMATÜR olarak, yapı malzemeleri sektöründe kaliteli ve uzun ömürlü çözümler sunmak amacıyla yola çıktık. Bugün gelinen noktada, binlerce konut ve iş merkezi projesinde imzamızın bulunmasının gururunu yaşıyoruz.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Özellikle profil grupları ve armatür çözümlerinde uzmanlaşan ekibimiz, modern tasarım anlayışını yüksek mühendislik kalitesiyle birleştirerek projelerinize değer katmaktadır.
                </p>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors group">
                      <stat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl sm:text-3xl font-black text-secondary-900 mb-1">{stat.value}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-secondary-900 rounded-[40px] p-8 sm:p-10 md:p-16 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <h3 className="text-2xl font-black mb-8 uppercase tracking-widest italic text-primary">Vizyonumuz & Misyonumuz</h3>
              <div className="space-y-12">
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                    Vizyon
                  </h4>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    Türkiye'nin ve bölgenin en güvenilir yapı malzemesi tedarikçisi olarak, sektördeki standartları belirleyen yenilikçi bir marka olmak.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                    Misyon
                  </h4>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    Müşterilerimize en yüksek performanslı ürünleri en erişilebilir koşullarda sunmak ve her projede kusursuz estetiği garanti altına almak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-secondary-900 uppercase tracking-tight mb-4 text-center">Değerlerimiz</h2>
            <p className="text-gray-500 font-medium text-center">Bizi biz yapan, her işimizde bağlı kaldığımız temel prensiplerimiz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <val.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-secondary-900 mb-4 uppercase tracking-tighter">{val.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-secondary-900 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter italic leading-tight">
            PROFESYONEL ÇÖZÜMLER İÇİN <br /> <span className="text-primary not-italic">BİZİMLE İLETİŞİME GEÇİN</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/iletisim" 
              className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-primary-600 text-white font-black rounded-2xl transition-all hover:scale-105 shadow-xl shadow-primary/30 uppercase tracking-widest text-sm text-center"
            >
              İLETİŞİME GEÇ
            </Link>
            <Link 
              to="/urunler" 
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 backdrop-blur-md uppercase tracking-widest text-sm text-center"
            >
              ÜRÜNLERİMİZİ GÖR
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
