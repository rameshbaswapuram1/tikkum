export type DemoOrderStatus =
  | "New"
  | "Accepted"
  | "Packing"
  | "Ready"
  | "On route";

export type DemoOrder = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  age: string;
  status: DemoOrderStatus;
};

export const merchantOrders: DemoOrder[] = [
  {
    id: "TK-2048",
    customer: "Ananya R.",
    items: ["Farm eggs", "Mangoes", "Curd"],
    total: 486,
    age: "2 min ago",
    status: "New",
  },
  {
    id: "TK-2047",
    customer: "Rohan M.",
    items: ["Sourdough", "Strawberries"],
    total: 355,
    age: "5 min ago",
    status: "Accepted",
  },
  {
    id: "TK-2046",
    customer: "Meera S.",
    items: ["Tomatoes", "Baby spinach", "Milk"],
    total: 291,
    age: "8 min ago",
    status: "Packing",
  },
];

export const packItems = [
  {
    id: "mangoes",
    name: "Alphonso mangoes",
    detail: "4 pcs · ripe, no bruises",
    location: "Produce · A2",
  },
  {
    id: "eggs",
    name: "Farm eggs",
    detail: "1 pack · check for cracks",
    location: "Chiller · C1",
  },
  {
    id: "curd",
    name: "Fresh curd",
    detail: "500 g · use by Oct 04",
    location: "Chiller · C3",
  },
  {
    id: "bread",
    name: "Whole wheat bread",
    detail: "1 loaf · today's batch",
    location: "Bakery · B1",
  },
];

export const routeStops = [
  {
    id: "pickup-1",
    type: "Pickup",
    time: "12:18",
    name: "Green Basket Market",
    address: "Road No. 36, Jubilee Hills",
    detail: "2 orders · TK-2048, TK-2047",
  },
  {
    id: "pickup-2",
    type: "Pickup",
    time: "12:26",
    name: "Butter & Bloom Bakery",
    address: "Jubilee Hills Check Post",
    detail: "1 order · TK-2046",
  },
  {
    id: "drop-1",
    type: "Drop-off",
    time: "12:38",
    name: "Ananya Reddy",
    address: "Plot 14, Kavuri Hills",
    detail: "3 bags · leave at door",
  },
  {
    id: "drop-2",
    type: "Drop-off",
    time: "12:47",
    name: "Rohan Mehta",
    address: "Road No. 45, Jubilee Hills",
    detail: "Keep chilled items upright",
  },
];

export const tenants = [
  {
    name: "Green Basket Market",
    category: "Groceries",
    plan: "Growth",
    orders: 186,
    status: "Live",
  },
  {
    name: "House of Biryani",
    category: "Restaurant",
    plan: "Scale",
    orders: 142,
    status: "Live",
  },
  {
    name: "Butter & Bloom",
    category: "Bakery",
    plan: "Starter",
    orders: 89,
    status: "Live",
  },
  {
    name: "Wok This Way",
    category: "Restaurant",
    plan: "Growth",
    orders: 67,
    status: "Review",
  },
];

export const fleetZones = [
  { name: "Jubilee Hills", active: 18, coverage: 92 },
  { name: "Banjara Hills", active: 12, coverage: 81 },
  { name: "Madhapur", active: 9, coverage: 68 },
];
