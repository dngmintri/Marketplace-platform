export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE" | "SOLD_OUT" | "DELETED";
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  images: ProductImage[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "createdAt";
  sortDir?: "asc" | "desc";
  page?: number;
  size?: number;
}
