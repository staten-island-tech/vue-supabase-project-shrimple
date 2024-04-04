export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export interface cart {
  [key: string]: number;
}
