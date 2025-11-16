import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

// Specific hooks for common selectors
export const useUser = () => useAppSelector((state) => state.userSlice.user);
export const useCart = () => useAppSelector((state) => state.cartSlice);

// Custom hook for favorite operations
export const useFavorites = () => {
  const user = useUser();
  
  const isFavorite = (productId: string): boolean => {
    return user?.favorites?.includes(productId) || false;
  };

  const getFavoritesCount = (): number => {
    return user?.favorites?.length || 0;
  };

  return {
    favorites: user?.favorites || [],
    isFavorite,
    getFavoritesCount,
  };
};
