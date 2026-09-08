import { useQuery } from "@tanstack/react-query";
import { loadProducts, getProducts } from "../data/productsData";

export default function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: loadProducts,
    initialData: getProducts().length > 0 ? getProducts() : undefined,
    staleTime: 5 * 60 * 1000,
  });
}