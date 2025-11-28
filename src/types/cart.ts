// types/cart.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface CartState {
  [x: string]: any;
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

export interface AddToCartPayload {
  [x: string]: any;
  product_id: number;
  quantity: number;
  category_id: number;
  size: number;
}

export interface UpdateCartPayload {
  cartId: number;
  quantity: number;
}