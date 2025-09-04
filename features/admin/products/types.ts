export type Categories =
  | 'African designs'
  | 'Corporate looks'
  | 'Everyday fashion'
  | 'Chic Fashion'
  | 'Sporty'
  | 'Others'

export type Category = {
  id: string,
  name: string
}

export type Product = {
    id: string,
    name: string,
    description: string,
    price: number,
    stock_quantity: number,
    category_id: string,
    image_url: string,
    image_path?: string,
}

export type ProductsInfiniteData = {
  pages: {
    products: Product[];
    nextPage: number | null;
  }[];
  pageParams: unknown[];
};

export type fetchProductsFiltersArgs = {
  pageParam?: number;
  category?: string | null;
  priceRange?: [number,number] | null;
  limit?: number;
}