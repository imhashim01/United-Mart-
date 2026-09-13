import axios from "axios";
import { mapApiProduct, normalizeProduct } from "./productsData";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

const FIELDS = "name,slug,sku,price,discountPrice,unit,stock,category,brand,images,variants,isFeatured,isBestSeller,isTodaysDeal,ratings";

const fetchLightProducts = async (params) => {
  const { data } = await api.get("/products", { params: { fields: FIELDS, ...params } });
  const rawList = data?.data ?? [];
  return rawList.map((p, i) => normalizeProduct(mapApiProduct(p), `product-${i + 1}`));
};

export const fetchFeaturedProducts = () => fetchLightProducts({ isFeatured: true, limit: 8 });
export const fetchBestSellers = () => fetchLightProducts({ isBestSeller: true, limit: 5 });
export const fetchTodaysDeals = () => fetchLightProducts({ isTodaysDeal: true, limit: 6 });
export const fetchProductsByCategory = (categoryId, limit = 200) =>
  fetchLightProducts({ category: categoryId, limit });