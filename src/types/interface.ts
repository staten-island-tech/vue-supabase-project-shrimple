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

export interface Order {
  id: string;
  created_at: string;
  status: string;
  data: Cart;
  user_id: string;
  notes: string;
}
