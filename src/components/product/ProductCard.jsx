import { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import FavoriteButton from '../ui/FavoriteButton';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [imageError, setImageError] = useState(false);
  const isAddingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (product.variations) {
      if (product.variations.type === 'length') {
        setSelectedVariation(product.variations.options[0]);
      } else if (product.variations.type === 'color' || product.variations.type === 'technical') {
        setSelectedVariation(product.variations.options[0]);
      } else if (product.variations.type === 'combined') {
        setSelectedVariation({
          dimension: product.variations.dimensions[0].size,
          color: product.variations.colors[0].value,
        });
      }
    }
  }, [product]);

  const getCurrentPrice = () => {
    if (!product.variations) return product.price || product.basePrice || 0;
    switch (product.variations.type) {
      case 'length':
        return (product.basePrice * selectedVariation) / 100;
      case 'color':
      case 'technical':
        return selectedVariation?.price || product.basePrice;
      case 'combined':
        const dim = product.variations.dimensions.find(d => d.size === selectedVariation?.dimension);
        return dim?.price || product.basePrice;
      default:
        return product.price || product.basePrice || 0;
    }
  };

  const handleAddToCart = () => {
    if (isAddingRef.current) return;
    
    isAddingRef.current = true;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const cartItem = {
      id: product.id || product._id,
      name: product.name,
      image: product.image,
      price: getCurrentPrice(),
      quantity: 1,
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
      } else if (product.variations.type === 'technical') {
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
    
    timeoutRef.current = setTimeout(() => {
      isAddingRef.current = false;
      timeoutRef.current = null;
    }, 2000);
  };

  const renderVariations = () => {
    if (!product.variations) return null;

    switch (product.variations.type) {
      case 'length':
        return (
          <div className="mb-4">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Uzunluk (cm)</label>
            <select
              value={selectedVariation}
              onChange={(e) => setSelectedVariation(Number(e.target.value))}
              className="w-full !p-2 !h-9 text-xs border border-gray-200 rounded-lg focus:border-primary bg-gray-50/50"
            >
              {product.variations.options.map((len) => (
                <option key={len} value={len}>{len} cm</option>
              ))}
            </select>
          </div>
        );

      case 'color':
        return (
          <div className="mb-4">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1.5">Renk</label>
            <div className="flex flex-wrap gap-1.5">
              {product.variations.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedVariation(opt)}
                  className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                    selectedVariation?.value === opt.value
                      ? 'border-primary scale-110 shadow-sm'
                      : 'border-transparent bg-white shadow-sm shadow-gray-200'
                  }`}
                  title={opt.value}
                >
                  <div 
                    className="w-full h-full rounded-full border border-gray-100" 
                    style={{ backgroundColor: opt.color }}
                  />
                </button>
              ))}
            </div>
          </div>
        );

      case 'technical':
        return (
          <div className="mb-4">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Tip</label>
            <select
              value={selectedVariation?.value}
              onChange={(e) => {
                const opt = product.variations.options.find(o => o.value === e.target.value);
                setSelectedVariation(opt);
              }}
              className="w-full !p-2 !h-9 text-xs border border-gray-200 rounded-lg focus:border-primary bg-gray-50/50"
            >
              {product.variations.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.value}</option>
              ))}
            </select>
          </div>
        );

      case 'combined':
        return (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Ölçü</label>
              <select
                value={selectedVariation?.dimension}
                onChange={(e) =>
                  setSelectedVariation({ ...selectedVariation, dimension: e.target.value })
                }
                className="w-full !p-2 !h-9 text-xs border border-gray-200 rounded-lg focus:border-primary bg-gray-50/50"
              >
                {product.variations.dimensions.map((dim) => (
                  <option key={dim.size} value={dim.size}>{dim.size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Renk</label>
              <div className="flex flex-wrap gap-1">
                {product.variations.colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setSelectedVariation({ ...selectedVariation, color: color.value })
                    }
                    className={`w-6 h-6 rounded-full border-2 transition-all p-0.5 ${
                      selectedVariation?.color === color.value
                        ? 'border-primary scale-110 shadow-sm'
                        : 'border-transparent bg-white shadow-sm shadow-gray-200'
                    }`}
                    title={color.value}
                  >
                    <div 
                      className="w-full h-full rounded-full border border-gray-100" 
                      style={{ backgroundColor: color.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col transition-all duration-300 relative group hover:shadow-medium">
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton product={product} />
      </div>
      
      {/* Tükendi Rozeti */}
      {product.stock <= 0 && (
        <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg uppercase tracking-wider">
          TÜKENDİ
        </div>
      )}

      {/* Resim alanı */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50/50 flex items-center justify-center p-6">
        {imageError ? (
          <div className={`w-full h-full flex items-center justify-center ${product.stock <= 0 ? 'opacity-30' : ''}`}>
            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">Görsel Yok</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className={`max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 ${product.stock <= 0 ? 'opacity-40 grayscale' : ''}`}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-[15px] font-black text-secondary-800 mb-1 leading-snug uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[40px] italic">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-[11px] text-gray-400 mb-4 line-clamp-1 font-medium">{product.description}</p>
        )}

        <div className="mt-auto">
          {renderVariations()}
        </div>
      </div>

      {/* Fiyat ve Buton Alanı */}
      <div className="mt-2 pt-4 border-t border-gray-50">
        <div className="flex flex-col mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-secondary-900 tracking-tighter">
              {getCurrentPrice().toFixed(2)}
              <span className="text-[11px] font-bold ml-1 text-gray-400 uppercase">TL</span>
            </span>
            {product.basePrice && product.price && product.basePrice > product.price && (
              <span className="text-xs font-bold text-gray-300 line-through">
                {product.basePrice.toFixed(2)} TL
              </span>
            )}
          </div>
          {product.variations?.type === 'length' && (
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tight mt-0.5">
              Birim Fiyat: {product.basePrice} TL/m
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (product.stock > 0) handleAddToCart();
          }}
          onMouseDown={(e) => e.preventDefault()}
          disabled={product.stock <= 0}
          className={`w-full !h-12 !rounded-xl font-black transition-all duration-300 uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-sm ${
            product.stock <= 0 
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-none' 
              : 'bg-primary hover:bg-primary-600 text-white hover:shadow-lg hover:shadow-primary/20'
          }`}
        >
          {product.stock <= 0 ? 'STOKTA YOK' : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>SEPETE EKLE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;