import { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, updateDoc, deleteDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { products as mockProducts } from '../data/mockProducts';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Firestore'dan ürünleri dinle (sadece bir kez başlatılır)
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        if (querySnapshot.empty) {
          // Eğer Firestore tamamen boşsa (ilk kurulum), mock ürünleri Firestore'a yükle
          const batchPromises = mockProducts.map(async (p) => {
            const docRef = doc(db, 'products', p.id.toString());
            const normalizedProduct = {
              ...p,
              id: p.id.toString(),
              _id: p.id.toString(),
              price: p.price || p.basePrice || 0,
              stock: p.stock || 100,
              image: p.image || '/placeholder-product.jpg',
              images: p.images || [p.image || '/placeholder-product.jpg'],
              createdAt: new Date().toISOString()
            };
            return setDoc(docRef, normalizedProduct);
          });
          await Promise.all(batchPromises);
          // Yüklendikten sonra onSnapshot tekrar tetiklenecek
        } else {
          // Firestore'da veri varsa state'e al
          const productsData = querySnapshot.docs.map(d => ({
            ...d.data(),
            id: d.id,
            _id: d.id
          }));
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Ürünler getirilirken hata:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error("Firestore dinleme hatası:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Boş dizi: Sadece bir kez çalışır

  // Yeni ürün ekleme (Firestore'a)
  const addProduct = async (productData) => {
    try {
      const newId = Date.now().toString();
      const newProduct = {
        ...productData,
        id: newId,
        _id: newId,
        createdAt: new Date().toISOString(),
        salePrice: productData.salePrice || productData.price || 0,
      };
      await setDoc(doc(db, 'products', newId), newProduct);
      return newProduct;
    } catch (err) {
      console.error("Ürün ekleme hatası:", err);
      throw err;
    }
  };

  // Ürün güncelleme (Firestore'da)
  const updateProduct = async (id, productData) => {
    try {
      const idStr = id?.toString();
      const productRef = doc(db, 'products', idStr);
      const updateData = {
        ...productData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(productRef, updateData);
      return { id: idStr, ...updateData };
    } catch (err) {
      console.error("Ürün güncelleme hatası:", err);
      throw err;
    }
  };

  // Ürün silme (Firestore'dan)
  const deleteProduct = async (id) => {
    try {
      const idStr = id?.toString();
      await deleteDoc(doc(db, 'products', idStr));
    } catch (err) {
      console.error("Ürün silme hatası:", err);
      throw err;
    }
  };

  // Geriye dönük uyumluluk
  const fetchProducts = () => {};

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};