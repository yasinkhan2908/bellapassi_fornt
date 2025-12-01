// types/cart.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

// types/cart.ts
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  size: string; // Add this
  product: {
    id: number;
    product_name: string;
    price: string | number;
    mrp: string | number;
    discount: string | number;
    product_image: {
      image: string;
    };
  };
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