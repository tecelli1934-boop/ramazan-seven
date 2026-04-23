import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, ChevronDown, Search, Phone, Instagram, Facebook, ChevronRight, MessageCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCategories } from '../../contexts/CategoryContext';
import { useProducts } from '../../contexts/ProductContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef(null);
  const searchRef = useRef(null);
  const { cart } = useCart();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { categories, getSubcategories } = useCategories();
  const { products } = useProducts();
  const navigate = useNavigate();

  // Arama önerileri filtreleme - Optimize with useMemo
  const suggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return products
      .filter(p => 
        p.name?.toLowerCase().includes(query) || 
        categories.find(c => c.id === p.category)?.name?.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [searchQuery, products, categories]);

  // Click outside to close search suggestions
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const favCount = favorites.items.length;

  const handleMouseEnter = (categoryId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300); // Slightly more delay for better UX
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/urunler?search=${query}`);
    } else {
      navigate('/urunler'); // Boş aramada tüm ürünlere git
    }
    setIsOpen(false); // Mobil menü açıksa kapat
  };

  return (
    <nav className="bg-[#0d1117] border-b border-[#2281BB]/20 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-[12px] font-bold">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+905555555555" className="flex items-center gap-1.5 hover:text-white/80 transition">
              <Phone className="w-3.5 h-3.5" />
              <span>+90 555 555 55 55</span>
            </a>
            <span className="hidden md:block opacity-60">|</span>
            <Link to="/iletisim" className="hidden md:block hover:text-white/80 transition">Destek Merkezi</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Instagram className="w-4 h-4" /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Facebook className="w-4 h-4" /></a>
              <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><MessageCircle className="w-4 h-4" /></a>
            </div>
            <span className="hidden sm:block opacity-40">|</span>
            <Link to="/siparis-takip" className="hover:text-white/80 transition uppercase tracking-tight text-[10px] sm:text-[12px]">Sipariş Takibi</Link>
          </div>
        </div>
      </div>

      {/* Main Bar (Logo, Search, Icons) */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between gap-2 md:gap-12">
          {/* Mobile Menu Icon (Left) */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary transition-all active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

          {/* Logo (Center-left on mobile, left on desktop) */}
          <Link to="/" className="flex-shrink-0 group mr-auto md:mr-0">
            <span className="text-lg sm:text-2xl md:text-3xl font-black text-primary tracking-tighter transition-all group-hover:scale-105 inline-block uppercase leading-tight">
              SVN PROFİL <br className="sm:hidden" /> <span className="text-white">ARMATÜR</span>
            </span>
          </Link>

          {/* Search Bar (Desktop Only) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative group" ref={searchRef}>
            <input
              type="text"
              placeholder="Aradığınız ürünü veya kategoriyi yazınız..."
              className="w-full !rounded-2xl border-2 border-[#2281BB]/25 focus:border-primary !pl-16 pr-16 h-14 text-[15px] bg-[#161b22] text-white transition-all focus:bg-[#1c2230] focus:shadow-lg focus:shadow-primary/10 font-medium"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-600 transition-all font-black text-xs uppercase tracking-widest shadow-md shadow-primary/20"
            >
              ARA
            </button>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#161b22] rounded-2xl shadow-2xl border border-[#2281BB]/20 z-[100] overflow-hidden animate-slide-down">
                <div className="p-2">
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                    Önerilen Ürünler
                  </div>
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        navigate(`/urun/${product.slug || product.id}`);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 transition-all rounded-xl text-left group/item"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={product.image || product.images?.[0] || '/placeholder-product.jpg'} 
                          alt={product.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-800 truncate group-hover/item:text-primary transition-colors">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                          {categories.find(c => c.id === product.category)?.name || 'Kategorisiz'}
                        </div>
                      </div>
                      <div className="text-sm font-black text-primary">
                        {product.price?.toLocaleString('tr-TR')} ₺
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full mt-1 p-3 text-center text-xs font-black text-gray-500 hover:text-primary hover:bg-primary/5 transition-all rounded-xl uppercase tracking-widest border-t border-gray-50"
                  >
                    Tüm Sonuçları Gör ({searchQuery})
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Actions (Right) */}
          <div className="flex items-center gap-0 sm:gap-4">
            {/* User */}
            <Link 
              to={user ? (user.role === 'admin' ? '/admin' : '/profil') : '/giris'} 
              className="flex flex-col items-center group relative scale-90 sm:scale-100"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center transition-all rounded-2xl group-hover:bg-primary/5">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-primary transition-colors" />
              </div>
              <span className="hidden lg:block text-[9px] font-black text-gray-400 group-hover:text-primary uppercase tracking-[0.1em] mt-1 transition-colors">
                {user ? (user.role === 'admin' ? 'PANEL' : 'HESABIM') : 'GİRİŞ'}
              </span>
            </Link>

            {/* Favorites */}
            <Link to="/favoriler" className="flex flex-col items-center group relative scale-90 sm:scale-100">
              <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center transition-all rounded-2xl group-hover:bg-primary/5">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-primary transition-colors" />
                {favCount > 0 && (
                  <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-primary text-white text-[9px] sm:text-[10px] font-black rounded-lg min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 flex items-center justify-center border-2 border-white shadow-md">
                    {favCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-[9px] font-black text-gray-400 group-hover:text-primary uppercase tracking-[0.1em] mt-1 transition-colors">FAVORİLER</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex flex-col items-center group relative scale-90 sm:scale-100">
              <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center transition-all rounded-2xl group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-white transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-black rounded-lg min-w-[18px] sm:min-w-[22px] h-4 sm:h-5 px-1 flex items-center justify-center border-2 border-white shadow-md">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-[9px] font-black text-gray-400 group-hover:text-primary uppercase tracking-[0.1em] mt-1 transition-colors">SEPETİM</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Bar (Desktop) */}
      <div className="hidden md:block bg-[#0d1117] border-t border-[#2281BB]/20 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-start gap-1 py-1">
            <Link
              to="/urunler"
              className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-gray-800 hover:text-primary transition-all border-b-2 border-transparent hover:border-primary whitespace-nowrap"
            >
              TÜM ÜRÜNLER
            </Link>
            
            {categories.filter(cat => (!cat.parentId || cat.parentId === '') && cat.isActive !== false).map((category) => {
              // Ensure we match IDs correctly (trim whitespace if any)
              const subcategories = categories.filter(s => s.parentId?.trim() === category.id.trim() && s.isActive !== false);
              return (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link to={`/kategori/${category.slug}`}>
                    <button className={`flex items-center gap-1 px-3 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                      openDropdown === category.id 
                      ? 'border-primary text-primary bg-primary/5' 
                      : 'border-transparent text-gray-800 hover:text-primary hover:border-primary'
                    }`}>
                      {category.name}
                      {subcategories.length > 0 && <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${openDropdown === category.id ? 'rotate-180' : ''}`} />}
                    </button>
                  </Link>
                  
                  {openDropdown === category.id && subcategories.length > 0 && (
                    <div
                      className="absolute top-full left-0 w-72 bg-[#161b22] shadow-2xl rounded-b-2xl border-x border-b border-[#2281BB]/20 z-50 animate-slide-down overflow-hidden"
                    >
                      <Link
                        to={`/kategori/${category.slug}`}
                        className="flex items-center justify-between px-8 py-5 bg-primary text-white hover:bg-primary-600 transition-colors font-black text-[11px] uppercase tracking-widest"
                        onClick={() => setOpenDropdown(null)}
                      >
                        TÜM {category.name} ÜRÜNLERİ
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <div className="py-3 bg-[#161b22] max-h-[400px] overflow-y-auto custom-scrollbar">
                        {subcategories.map(sub => (
                          <Link
                            key={sub.id}
                            to={`/kategori/${sub.slug}`}
                            className="block px-8 py-3.5 hover:bg-gray-50 text-gray-600 hover:text-primary transition-all text-xs font-bold uppercase tracking-tight border-l-4 border-transparent hover:border-primary"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-[#2281BB]/20 py-4 absolute inset-x-0 top-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in max-h-[85vh] overflow-y-auto z-[60]">
          <div className="px-4 flex flex-col gap-2">
            <Link
              to="/urunler"
              className="px-6 py-4 bg-primary text-white font-black rounded-2xl mb-4 text-center shadow-lg shadow-primary/20"
              onClick={() => setIsOpen(false)}
            >
              TÜM ÜRÜNLERİ GÖR
            </Link>
            <div className="flex flex-col gap-1">
              <h3 className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategoriler</h3>
              {categories.filter(cat => (!cat.parentId || cat.parentId === '') && cat.isActive !== false).map((category) => (
                <div key={category.id} className="border-b border-gray-50 last:border-0">
                  <Link
                    to={`/kategori/${category.slug}`}
                    className="flex items-center justify-between px-5 py-4 text-gray-800 font-bold hover:text-primary transition active:bg-gray-50 rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{category.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Mobile Account Info */}
            <div className="mt-4 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3 px-2 pb-6">
              <Link to="/profil" className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600" onClick={() => setIsOpen(false)}>
                <User className="w-4 h-4" /> HESABIM
              </Link>
              <Link to="/favoriler" className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600" onClick={() => setIsOpen(false)}>
                <Heart className="w-4 h-4" /> FAVORİLER
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
