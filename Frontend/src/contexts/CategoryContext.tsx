import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CategoryType } from '@/interface/categoryInterface';

interface CategoryContextType {
  categories: CategoryType[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>;
  addCategory: (category: CategoryType) => void;
  removeCategory: (categoryId: string) => void;
  refreshCategories: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

  const addCategory = (category: CategoryType) => {
    setCategories(prev => [category, ...prev]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const refreshCategories = async () => {
    // This will be implemented by the component that uses the context
    // since it needs access to the fetchCategories function
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      setCategories,
      addCategory,
      removeCategory,
      refreshCategories,
      loading,
      setLoading
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};
