export type Product = {
  id: string;
  name: string;
  category: string;
  /** Money is stored in paisa (100 paisa = 1 BDT). */
  price: number;
  stock: number;
};

export const demoProducts: Product[] = [
  { id: "notebook", name: "Everyday notebook", category: "Stationery", price: 12000, stock: 20 },
  { id: "pens", name: "Black ink pen set", category: "Stationery", price: 8000, stock: 30 },
  { id: "algorithms", name: "Algorithms handbook", category: "Books", price: 45000, stock: 8 },
  { id: "planner", name: "Weekly study planner", category: "Stationery", price: 18000, stock: 12 },
  { id: "bottle", name: "Campus water bottle", category: "Essentials", price: 35000, stock: 10 },
  { id: "tote", name: "Everyday canvas tote", category: "Essentials", price: 25000, stock: 15 },
];

export function formatPrice(paisa: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(paisa / 100);
}
