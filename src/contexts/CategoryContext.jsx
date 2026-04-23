import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';

const CategoryContext = createContext();

export const useCategories = () => {
  return useContext(CategoryContext);
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Firestore'tan gerçek zamanlı kategorileri çekme
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    
    // YUKARIYA: Kategori dinleyici (onSnapshot) sadece bir kez (mount anında) başlatılır.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCategories(cats);
      setLoading(false);
    }, (err) => {
      console.error("Kategori çekme hatası (onSnapshot):", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Boş dizi: Sadece bir kez çalışır.

  // Yeni Kategori Ekleme
  const addCategory = async (categoryData) => {
    try {
      console.log("Yeni kategori ekleme isteği:", categoryData);
      
      // Slug oluştur
      const slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const order = categories.length > 0 ? Math.max(...categories.map(c => c.order || 0)) + 1 : 1;

      const finalData = {
        name: categoryData.name.trim(),
        parentId: categoryData.parentId || null,
        slug,
        order,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
        createdAt: new Date().toISOString()
      };

      console.log("Firestore'a (categories) eklenecek veri:", finalData);
      const docRef = await addDoc(collection(db, 'categories'), finalData);
      console.log("Kategori başarıyla eklendi! Atanan ID:", docRef.id);
      return true;
    } catch (err) {
      console.error("Kategori ekleme hatası:", err);
      throw err;
    }
  };

  // Kategori Güncelleme
  const updateCategory = async (id, categoryData) => {
    try {
      const categoryRef = doc(db, 'categories', id);
      
      const updateData = { 
        ...categoryData,
        name: categoryData.name?.trim(),
        parentId: categoryData.parentId || null 
      };
      
      // İsim değiştiyse slug'ı da güncelle
      if (categoryData.name) {
         updateData.slug = categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }

      // Dokümanda id alanı saklamamaya çalış (Firestore'un kendi ID'si yeterli)
      delete updateData.id;

      await updateDoc(categoryRef, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Kategori güncelleme hatası:", err);
      throw err;
    }
  };

  // Kategori Silme
  const deleteCategory = async (id, reassignToId = 'diger') => {
    try {
      console.log("Kategori silme isteği geldi. ID:", id, "ReassignTo:", reassignToId);
      // Bu kategoriye ait ürünleri bul ve başka bir kategoriye taşı
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('category', '==', id));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      
      if (!querySnapshot.empty) {
        querySnapshot.docs.forEach((productDoc) => {
          batch.update(productDoc.ref, { category: reassignToId });
        });
        console.log(`${querySnapshot.size} ürün yeni kategoriye (${reassignToId}) taşındı.`);
      }

      // Alt kategorileri varsa onları da ana kategoriye çek
      const subCatsQ = query(collection(db, 'categories'), where('parentId', '==', id));
      const subCatsSnapshot = await getDocs(subCatsQ);
      if (!subCatsSnapshot.empty) {
        subCatsSnapshot.docs.forEach((catDoc) => {
          batch.update(catDoc.ref, { parentId: null });
        });
      }

      // Kategoriyi sil
      console.log("Firestore'dan silinme isteği gönderiliyor (Batch delete)...");
      batch.delete(doc(db, 'categories', id));
      
      await batch.commit();
      console.log("Kategori başarıyla silindi (Firestore onayı)!");
      return true;
    } catch (err) {
      console.error("Kategori silme hatası:", err);
      throw err;
    }
  };

  // Alt kategorileri bulma helper'ı
  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  const value = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getSubcategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
