import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, PenTool, LayoutGrid, Award, ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState('tümü');

  const categories = [
    { id: 'tümü', label: 'Tüm Projeler' },
    { id: 'profil', label: 'Profil Sistemleri' },
    { id: 'armatur', label: 'Armatür Çözümleri' },
    { id: 'ozel', label: 'Özel Tasarım' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Modern Ofis Kompleksi',
      category: 'profil',
      client: 'TechCorp A.Ş.',
      description: 'Geniş açıklıklı ofis alanları için özel tasarım alüminyum profil sistemleri ve cephe kaplamaları.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      features: ['Özel Ekstrüzyon', 'Isı Yalıtımlı Seriler', 'Kolay Montaj']
    },
    {
      id: 2,
      title: 'Lüks Konut Projesi (Marina)',
      category: 'armatur',
      client: 'Vadi Yapı',
      description: 'Deniz kenarı lüks konutlar için korozyona dayanıklı, premium seri banyo ve mutfak armatürleri.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      features: ['Korozyon Direnci', 'Gizli Tesisat', 'Tasarruflu Kartuş']
    },
    {
      id: 3,
      title: 'Alışveriş Merkezi Cephesi',
      category: 'profil',
      client: 'Meydan AVM',
      description: 'Geniş vitrin camları ve ağır yük taşımaya uygun güçlendirilmiş endüstriyel profil çözümleri.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
      features: ['Yüksek Mukavemet', 'Geniş Cam Boşluğu', 'Dış Cephe Uyumu']
    },
    {
      id: 4,
      title: 'Boutique Otel Renovasyonu',
      category: 'ozel',
      client: 'Bosphorus Hotel',
      description: 'Otele özel olarak tasarlanmış, altın varaklı ve pirinç detaylı butik armatür ve aydınlatma profilleri.',
      image: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce66f?q=80&w=2070&auto=format&fit=crop',
      features: ['Pirinç Kaplama', 'Özel Kalıp', 'Tarihi Dokuya Uyum']
    },
    {
      id: 5,
      title: 'Hastane Hijyen Odaları',
      category: 'armatur',
      client: 'Şifa Sağlık Grubu',
      description: 'Temassız kullanım ve antibakteriyel yüzey teknolojisine sahip medikal armatür sistemleri.',
      image: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?q=80&w=2074&auto=format&fit=crop',
      features: ['Sensörlü Akış', 'Antibakteriyel', 'Medikal Standart']
    },
    {
      id: 6,
      title: 'Açık Spor Kompleksi',
      category: 'profil',
      client: 'Belediye Spor Tesisleri',
      description: 'Dış hava şartlarına tam dayanıklı, paslanmazlık garantili çatı ve tribün profil iskeletleri.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
      features: ['Paslanmaz Alüminyum', 'Geniş Açıklık', 'Statik Onaylı']
    }
  ];

  const filteredProjects = activeCategory === 'tümü' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#151a23] min-h-screen pb-20">
      <SEO 
        title="Koleksiyon ve Projelerimiz" 
        description="SVN Profil Armatür tarafından gerçekleştirilen seçkin profil, cephe ve armatür projeleri."
      />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-[#161b22] border-b border-secondary-200">
        <div className="absolute inset-0 right-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary-500 hover:text-primary-400 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black text-[#f0f6fc] mb-6 uppercase tracking-tighter">
              Projelerinize <span className="text-primary-500">Değer Katın</span>
            </h1>
            <p className="text-lg md:text-xl text-[#8b949e] font-medium leading-relaxed mb-8">
              SVN Profil Armatür olarak, endüstriyel yapılardan lüks konutlara kadar birçok alanda yüksek kaliteli ve uzun ömürlü çözümler sunuyoruz. İşte imzamızı taşıyan bazı seçkin projeler.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-[#e6edf3]">
                <Building className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-sm">500+ Tamamlanan Proje</span>
              </div>
              <div className="flex items-center gap-2 text-[#e6edf3] ml-4">
                <Award className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-sm">Ödüllü Tasarımlar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-600/30'
                  : 'bg-[#161b22] text-[#8b949e] border-[#21262d] hover:border-primary-500/50 hover:text-[#e6edf3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group flex flex-col bg-[#161b22] rounded-2xl overflow-hidden border border-secondary-200 hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-900/20">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    {categories.find(c => c.id === project.category)?.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#f0f6fc] mb-2 group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-primary-500 text-sm font-semibold mb-4">
                  Müşteri: {project.client}
                </p>
                <p className="text-[#8b949e] text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.features.map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded bg-[#151a23] border border-[#21262d] text-[#e6edf3] text-[11px] font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-24 p-10 bg-gradient-to-br from-primary-900/40 to-[#161b22] border border-primary-500/20 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <LayoutGrid className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-[#f0f6fc] mb-4 uppercase tracking-tight">Kendi Projenizi Başlatın</h2>
            <p className="text-[#8b949e] mb-8">
              Mekanlarınıza özel, yüksek kaliteli profil ve armatür çözümleri için uzman ekibimizle hemen iletişime geçin.
            </p>
            <Link 
              to="/iletisim"
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-500/30 uppercase tracking-wide"
            >
              <PenTool className="w-5 h-5 mr-3" />
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
