export type Product = {
  id: string;
  name: string;
  category: string;
  /** Money is stored in paisa (100 paisa = 1 BDT). */
  price: number;
  stock: number;
  imageUrl?: string | null;
};

// Sample catalogue configurations; not verified manufacturer specifications.
export const demoProducts = [
  {
    "id": "notebook",
    "name": "Everyday notebook",
    "category": "Stationery",
    "price": 12000,
    "stock": 20,
    "description": "A simple home for lecture notes, first drafts, and ideas worth keeping. Its compact A5 format slips easily into your daily bag, while ruled pages bring a little order to a busy semester.",
    "specifications": {
      "Format": "A5 · 148 × 210 mm",
      "Pages": "160 pages",
      "Paper": "80 gsm",
      "Page layout": "Ruled",
      "Cover": "Black softcover",
      "Binding": "Thread-bound"
    },
    "imageUrl": "/images/products/notebook.jpg"
  },
  {
    "id": "pens",
    "name": "Black ink pen set",
    "category": "Stationery",
    "price": 8000,
    "stock": 30,
    "description": "Your everyday writing companions for lectures, revision, and the occasional great idea. A set of three black ballpoint pens keeps a spare close by, with a comfortable grip for longer note-taking sessions.",
    "specifications": {
      "Set contents": "3 ballpoint pens",
      "Ink colour": "Black",
      "Tip size": "0.7 mm",
      "Grip": "Textured grip",
      "Closure": "Removable cap",
      "Use": "Everyday writing and note-taking"
    },
    "imageUrl": "/images/products/pens.jpg"
  },
  {
    "id": "algorithms",
    "name": "Algorithms handbook",
    "category": "Books",
    "price": 45000,
    "stock": 8,
    "description": "A compact study companion for reviewing sorting, searching, graphs, and core problem-solving concepts. Designed for quick revision alongside your coursework, with a portable paperback format for study sessions wherever you settle in.",
    "specifications": {
      "Edition": "Campus study edition",
      "Language": "English",
      "Format": "A5 paperback",
      "Pages": "240 pages",
      "Topics": "Sorting, searching, graphs, and complexity",
      "Recommended level": "Introductory undergraduate study"
    },
    "imageUrl": "/images/products/algorithms.jpg"
  },
  {
    "id": "planner",
    "name": "Weekly study planner",
    "category": "Stationery",
    "price": 18000,
    "stock": 12,
    "description": "See the week at a glance and make space for what matters. An undated layout lets you start whenever you like, with room for classes, deadlines, and the smaller tasks that keep everything moving.",
    "specifications": {
      "Format": "A5 · 148 × 210 mm",
      "Layout": "Weekly overview",
      "Schedule": "Undated",
      "Planning period": "52 weeks",
      "Paper": "100 gsm",
      "Sections": "Weekly priorities, tasks, and notes"
    },
    "imageUrl": "/images/products/planner.jpg"
  },
  {
    "id": "bottle",
    "name": "Campus water bottle",
    "category": "Essentials",
    "price": 35000,
    "stock": 10,
    "description": "A clean, understated bottle for the walk to class and everything after. The reusable stainless steel body and screw-top closure make it an easy addition to your everyday carry.",
    "specifications": {
      "Capacity": "500 ml",
      "Body material": "Stainless steel",
      "Colour": "Chalk white",
      "Finish": "Matte",
      "Closure": "Screw cap",
      "Care": "Hand wash; air dry with the cap removed"
    },
    "imageUrl": "/images/products/bottle.jpg"
  },
  {
    "id": "tote",
    "name": "Everyday canvas tote",
    "category": "Essentials",
    "price": 25000,
    "stock": 15,
    "description": "Room for your notebook, daily essentials, and a little spontaneity. A neutral canvas finish pairs easily with your everyday wardrobe, while an open main compartment keeps the things you reach for close at hand.",
    "specifications": {
      "Main material": "Canvas",
      "Colour": "Natural beige",
      "Dimensions": "36 × 40 × 10 cm",
      "Compartments": "One main compartment",
      "Carry style": "Top handles and shoulder strap",
      "Care": "Spot clean and air dry"
    },
    "imageUrl": "/images/products/tote.jpg"
  }
] satisfies (Product & { description: string; specifications: Record<string, string> })[];

export function formatPrice(paisa: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(paisa / 100);
}
