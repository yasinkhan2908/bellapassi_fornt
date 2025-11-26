import axios from 'axios';

const api = axios.create({
  //baseURL: 'https://bellapassi.admin.engineers2.com/', // Laravel API URL
  baseURL: 'http://bellapassi.admin.engineers2.com/', // Laravel API URL
  withCredentials: false,            // include cookies (needed if using Sanctum)
});

export const addToCartApi = async (productId: any, quantity = 1) => {
  const response = await api.post("/cart/add", { product_id: productId, quantity });
  return response.data;
};

export const getCartApi = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export default api;
