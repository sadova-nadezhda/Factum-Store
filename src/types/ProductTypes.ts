export type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string | null;
};

export type CatalogResponse = {
  items: Product[];
};