export interface Product {
    id: string;
    name: string;
    price: number;
    size: string;
    description: string;
    inStock: boolean;
    image: string;
    category: 'cooking-oil' | 'premium-cooking-oil' | 'bulk';
  }