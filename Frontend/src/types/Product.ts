export type ProductVariant = {
  color?: string;
  size?: string;
  scent?: string;
  shape?: string;
  pose?: string;
  sku: string;
};

export type Product = {
  id: string;
  filename: string;
  type: string;
  title: string;
  description: string;
  color: string | string[];
  shape: string;
  price: number;
  scent?: string;
  tags: string[];
  variants?: ProductVariant[];
  sku?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
  };
  weight?: number;
  burnTime?: number;
  material?: string;
  category?: string;
  subcategory?: string;
  featured?: boolean;
  onSale?: boolean;
  originalPrice?: number;
  discount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CartItem = {
  productId: string;
  quantity: number;
  selectedVariant?: ProductVariant;
};

export type FilterOptions = {
  color?: string;
  size?: string;
  scent?: string;
  type?: string;
  price?: [number, number];
  category?: string;
  inStock?: boolean;
  onSale?: boolean;
};

export type SortConfig = {
  sortBy: "title" | "price" | "type" | "rating" | "newest";
  order: "asc" | "desc";
};

export type ProductCategory =
  | "נרות דקורטיביים"
  | "נרות ריחניים"
  | "נרות דמויות"
  | "נרות שבת"
  | "נרות יוקרה"
  | "נרות אקולוגיים"
  | "נרות מסיבה"
  | "נרות עונתיים";
