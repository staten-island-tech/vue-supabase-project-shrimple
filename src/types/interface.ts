export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export interface Cart {
  [key: string]: number;
}
