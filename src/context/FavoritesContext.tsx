import { createContext, useContext, useState, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  function addFavorite(id: string) {
    if (!favorites.includes(id)) {
      setFavorites([...favorites, id]);
    }
  }

  function removeFavorite(id: string) {
    setFavorites(favorites.filter(favId => favId !== id));
  }

  function clearFavorites() {
    setFavorites([]);
  }

  function isFavorite(id: string) {
    return favorites.includes(id);
  }

  return (
    <FavoritesContext.Provider 
      value={{ favorites, addFavorite, removeFavorite, clearFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
