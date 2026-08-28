"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { favoritesService } from "@/services/favorites.service";
import { useHasToken } from "@/hooks/useHasToken";
import { tokenStorage } from "@/utils/tokenStorage";
import { queryKeys } from "@/api/queryKeys";
import { PublicProduct } from "@/types/product";

interface FavoritesContextType {
  favoriteIds: string[];
  favoriteProducts: PublicProduct[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const hasToken = useHasToken();

const { data, isLoading } = useQuery({
  queryKey: queryKeys.savedItems,
  queryFn: favoritesService.getSavedItems,
  enabled: hasToken,
  retry: false,
});

  const favoriteProducts = data ?? [];
  const favoriteIds = favoriteProducts.map((p) => p.id);

  const toggleMutation = useMutation({
    mutationFn: (id: string) => favoritesService.toggleSave(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.savedItems });
      const previous = queryClient.getQueryData<typeof data>(queryKeys.savedItems);
      queryClient.setQueryData<typeof data>(queryKeys.savedItems, (old) => {
        if (!old) return old;
        const exists = old.some((p) => p.id === id);
        return exists ? old.filter((p) => p.id !== id) : old;
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.savedItems, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedItems });
    },
  });

  const toggleFavorite = (id: string) => {
    if (!tokenStorage.getAccessToken()) {
      console.warn("toggleFavorite called without auth token");
      return;
    }
    toggleMutation.mutate(id);
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const clearFavorites = async () => {
    if (!tokenStorage.getAccessToken()) return;
    const ids = favoriteIds;
    await Promise.all(ids.map((id) => favoritesService.removeSavedItem(id)));
    queryClient.invalidateQueries({ queryKey: queryKeys.savedItems });
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, favoriteProducts, toggleFavorite, isFavorite, clearFavorites, isLoading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}