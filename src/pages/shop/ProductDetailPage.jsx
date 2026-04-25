import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Plus, 
  Minus,
  Share2,
  Check
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCategories } from '../../contexts/CategoryContext';
import FavoriteButton from '../../components/ui/FavoriteButton';
import ProductCard from '../../components/product/ProductCard';
import SEO from '../../components/common/SEO';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { categories } = useCategories();
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && products.length > 0) {
      // Find product by slug or ID
      const foundProduct = products.find(p => (p.slug === productSlug || p.id.toString() === productSlug));
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Initialize variation
        if (foundProduct.variations) {
          if (foundProduct.variations.type === 'length') {
            setSelectedVariation(foundProduct.variations.options[0]);
          } else if (foundProduct.variations.type === 'color' || foundProduct.variations.type === 'technical' || foundProduct.variations.type === 'style') {
            setSelectedVariation(foundProduct.variations.options[0]);
          } else if (foundProduct.variations.type === 'combined') {
            setSelectedVariation({
              dimension: foundProduct.variations.dimensions[0].size,
              color: foundProduct.variations.colors[0].value,
            });
          }
        }

        // Set related products
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        // Product not found
        navigate('/urunler');
      }
    }
  }, [productSlug, products, loading, navigate]);

  const getCurrentPrice = () => {
    if (!product) return 0;
    if (!product.variations) return product.price || product.basePrice || 0;
    
    switch (product.variations.type) {
      case 'length':
        return (product.basePrice * selectedVariation) / 100;
      case 'color':
      case 'technical':
      case 'style':
        return selectedVariation?.price || product.basePrice;
      case 'combined':
        const dim = product.variations.dimensions.find(d => d.size === selectedVariation?.dimension);
        return dim?.price || product.basePrice;
      default:
        return product.price || product.basePrice || 0;
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id || product._id,
      name: product.name,
      image: product.image,
      price: getCurrentPrice(),
      quantity: quantity,
    };

    if (product.variations) {
      if (product.variations.type === 'length') {
        cartItem.selectedLength = selectedVariation;
        cartItem.variationText = `${selectedVariation} cm`;
        cartItem.variationKey = `len-${selectedVariation}`;
      } else if (product.variations.type === 'color') {
        cartItem.selectedColor = selectedVariation.value;
        cartItem.variationText = selectedVariation.value;
        cartItem.variationKey = `color-${selectedVariation.value}`;
      } else if (product.variations.type === 'technical' || product.variations.type === 'style') {
        cartItem.selectedTech = selectedVariation.value;
        cartItem.variationText = selectedVariation.value;
        cartItem.variationKey = `tech-${selectedVariation.value}`;
      } else if (product.variations.type === 'combined') {
        cartItem.selectedDimension = selectedVariation.dimension;
        cartItem.selectedColor = selectedVariation.color;
        cartItem.variationText = `${selectedVariation.dimension} / ${selectedVariation.color}`;
        cartItem.variationKey = `dim-${selectedVariation.dimension}-color-${selectedVariation.color}`;
      }
    } else {
      cartItem.variationKey = 'default';
      cartItem.variationText = '';
    }

    addToCart(cartItem);
    toast.success('Ürün sepete eklendi!');
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentCategory = categories.find(c => c.id === product.category);

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      <SEO 
        title={product.name} 
        description={product.description || `${product.name} ürün detayları ve fiyatı.`}
      />

      <div className="container mx-auto px-4 pt-28">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary transition">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/urunler" className="hover:text-primary transition">Ürünler</Link>
          {currentCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/kategori/${currentCategory.slug}`} className="hover:text-primary transition">{currentCategory.name}</Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden group shadow-soft">
              <img 
                src={product.images?.[activeImage] || product.image} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 right-6">
                <FavoriteButton product={product} />
              </div>
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-dark-bg/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-gray-800 text-white px-6 py-3 rounded-xl font-black tracking-widest text-lg shadow-2xl border border-white/10">STOKTA YOK</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 rounded-2xl bg-white p-2 border-2 transition-all flex-shrink-0 ${
                      activeImage === idx ? 'border-primary shadow-glow-sm' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg tracking-widest uppercase mb-4 border border-primary/20">
                {currentCategory?.name || 'Kategorisiz'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter mb-4 italic">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-gray-500 text-xs font-bold ml-2">(4.8 / 5.0)</span>
                </div>
                <div className="w-px h-4 bg-gray-700"></div>
                <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Stokta Var
                </span>
              </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-3xl p-8 mb-8 shadow-soft">
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-black text-white tracking-tighter italic">
                  {getCurrentPrice().toFixed(2)}
                  <span className="text-sm font-bold ml-1 text-gray-400 uppercase not-italic">TL</span>
                </span>
                {product.basePrice && product.price && product.basePrice > product.price && (
                  <span className="text-lg font-bold text-gray-500 line-through">
                    {product.basePrice.toFixed(2)} TL
                  </span>
                )}
              </div>

              {/* Variations Selection */}
              <div className="space-y-6 mb-8">
                {product.variations?.type === 'length' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Uzunluk (cm)</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variations.options.map((len) => (
                        <button
                          key={len}
                          onClick={() => setSelectedVariation(len)}
                          className={`px-4 py-3 rounded-xl border-2 font-bold transition-all text-sm ${
                            selectedVariation === len
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          {len} cm
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(product.variations?.type === 'color') && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Renk Seçimi</label>
                    <div className="flex flex-wrap gap-3">
                      {product.variations.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedVariation(opt)}
                          className={`group flex items-center gap-3 px-4 py-2 rounded-2xl border-2 transition-all ${
                            selectedVariation?.value === opt.value
                              ? 'border-primary bg-primary/5'
                              : 'border-white/5 bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded-full border border-white/10 shadow-inner" 
                            style={{ backgroundColor: opt.color }}
                          />
                          <span className={`text-xs font-bold ${selectedVariation?.value === opt.value ? 'text-primary' : 'text-gray-400'}`}>
                            {opt.value}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(product.variations?.type === 'technical' || product.variations?.type === 'style') && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Seçenek</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.variations.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedVariation(opt)}
                          className={`px-4 py-3 rounded-xl border-2 font-bold transition-all text-left text-xs ${
                            selectedVariation?.value === opt.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.variations?.type === 'combined' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Ölçü</label>
                      <div className="flex flex-wrap gap-2">
                        {product.variations.dimensions.map((dim) => (
                          <button
                            key={dim.size}
                            onClick={() => setSelectedVariation({ ...selectedVariation, dimension: dim.size })}
                            className={`px-4 py-3 rounded-xl border-2 font-bold transition-all text-xs ${
                              selectedVariation?.dimension === dim.size
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10'
                            }`}
                          >
                            {dim.size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Renk</label>
                      <div className="flex flex-wrap gap-3">
                        {product.variations.colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedVariation({ ...selectedVariation, color: color.value })}
                            className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${
                              selectedVariation?.color === color.value
                                ? 'border-primary scale-110'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                            title={color.value}
                          >
                            <div className="w-full h-full rounded-full" style={{ backgroundColor: color.color }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white transition active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center bg-transparent border-none text-white font-black text-lg focus:ring-0 p-0"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white transition active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 !h-14 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-xl ${
                    product.stock <= 0
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-600 text-white shadow-primary/20 hover:shadow-primary/40 active:scale-95'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>SEPETE EKLE</span>
                </button>
              </div>
            </div>

            {/* Product Features / Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hızlı Teslimat</div>
                  <div className="text-[11px] font-bold text-gray-300">24 Saatte Kargoda</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Güvenli Alışveriş</div>
                  <div className="text-[11px] font-bold text-gray-300">256-bit SSL Koruma</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Ürün Açıklaması</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {product.description || "Bu ürün yüksek kaliteli malzemelerden üretilmiştir ve uzun ömürlü kullanım sunar. SVN Profil Armatür güvencesiyle projelerinize değer katar."}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Benzer Ürünler</h2>
              <Link to="/urunler" className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Tümünü Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
