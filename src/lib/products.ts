export type Product = {
  id: string;
  name: string;
  category: string;
  /** Money is stored in paisa (100 paisa = 1 BDT). */
  price: number;
  stock: number;
  imageUrl?: string | null;
};

export const demoProducts: Product[] = [
  { id: "notebook", name: "Everyday notebook", category: "Stationery", price: 12000, stock: 20, imageUrl: "/images/products/notebook.jpg" },
  { id: "pens", name: "Black ink pen set", category: "Stationery", price: 8000, stock: 30, imageUrl: "/images/products/pens.jpg" },
  { id: "algorithms", name: "Algorithms handbook", category: "Books", price: 45000, stock: 8, imageUrl: "/images/products/algorithms.jpg" },
  { id: "planner", name: "Weekly study planner", category: "Stationery", price: 18000, stock: 12, imageUrl: "/images/products/planner.jpg" },
  { id: "bottle", name: "Campus water bottle", category: "Essentials", price: 35000, stock: 10, imageUrl: "/images/products/bottle.jpg" },
  { id: "tote", name: "Everyday canvas tote", category: "Essentials", price: 25000, stock: 15, imageUrl: "/images/products/tote.jpg" },
];

export function formatPrice(paisa: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(paisa / 100);
}
