import { SafetyZone, MapMarker } from "@/types/map";

export const safetyZones: SafetyZone[] = [
  {
    id: "edinburgh-main",
    name: "Edinburgh",
    coordinates: [],
    dayRisk: "safe",
    nightRisk: "safe",
    position: { x: "5%", y: "5%" },
    size: { width: "90%", height: "90%" }
  },
  {
    id: "north-outskirts",
    name: "North Outskirts",
    coordinates: [],
    dayRisk: "moderate",
    nightRisk: "dangerous",
    position: { x: "55%", y: "3%" },
    size: { width: "18%", height: "12%" }
  },
  {
    id: "west-outskirts",
    name: "West Outskirts",
    coordinates: [],
    dayRisk: "moderate",
    nightRisk: "moderate",
    position: { x: "8%", y: "48%" },
    size: { width: "14%", height: "16%" }
  },
  {
    id: "south-outskirts",
    name: "South Outskirts",
    coordinates: [],
    dayRisk: "moderate",
    nightRisk: "dangerous",
    position: { x: "30%", y: "78%" },
    size: { width: "16%", height: "14%" }
  },
  {
    id: "center-zone",
    name: "Cowgate",
    coordinates: [],
    dayRisk: "moderate",
    nightRisk: "dangerous",
    position: { x: "46%", y: "54%" },
    size: { width: "8%", height: "6%" }
  },
  {
    id: "east-outskirts",
    name: "East Outskirts",
    coordinates: [],
    dayRisk: "moderate",
    nightRisk: "moderate",
    position: { x: "78%", y: "60%" },
    size: { width: "14%", height: "16%" }
  }
];

export const eventsMarkers: MapMarker[] = [
  {
    id: "event-1",
    type: "events",
    name: "Edinburgh Fringe Preview",
    description: "Early preview performances from upcoming Fringe acts. Comedy, drama, and music.",
    address: "The Pleasance, 60 Pleasance",
    position: { x: "52%", y: "56%" },
    category: "Arts & Culture",
    date: "Today",
    time: "7:00 PM - 10:00 PM",
    price: "£15",
    image: "/placeholder.svg",
    entryType: "ticket-required"
  },
  {
    id: "event-2",
    type: "events",
    name: "Royal Mile Street Festival",
    description: "Live music, street performers, and local artisan market along the historic Royal Mile.",
    address: "Royal Mile",
    position: { x: "48%", y: "50%" },
    category: "Festival",
    date: "This Weekend",
    time: "12:00 PM - 8:00 PM",
    price: "Free",
    image: "/placeholder.svg",
    entryType: "walk-in"
  },
  {
    id: "event-3",
    type: "events",
    name: "Scottish Whisky Tasting Experience",
    description: "Guided tasting of 6 premium Scottish whiskies with expert sommelier.",
    address: "The Scotch Whisky Experience",
    position: { x: "44%", y: "48%" },
    category: "Food & Drink",
    date: "This Week",
    time: "6:30 PM - 8:30 PM",
    price: "£45",
    image: "/placeholder.svg",
    entryType: "ticket-required"
  },
  {
    id: "event-4",
    type: "events",
    name: "Ghost Tour: Underground Vaults",
    description: "Spine-chilling tour through Edinburgh's haunted underground vaults.",
    address: "Blair Street Underground Vaults",
    position: { x: "47%", y: "53%" },
    category: "Tours",
    date: "Today",
    time: "9:00 PM - 10:30 PM",
    price: "£18",
    image: "/placeholder.svg",
    entryType: "ticket-required"
  },
  {
    id: "event-5",
    type: "events",
    name: "Farmers Market at Castle Terrace",
    description: "Fresh local produce, artisan breads, cheeses, and handcrafted goods.",
    address: "Castle Terrace",
    position: { x: "41%", y: "46%" },
    category: "Market",
    date: "This Weekend",
    time: "9:00 AM - 3:00 PM",
    price: "Free",
    image: "/placeholder.svg",
    entryType: "walk-in"
  }
];

export const foodMarkers: MapMarker[] = [
  {
    id: "food-1",
    type: "food",
    name: "The Witchery by the Castle",
    description: "Luxury Scottish dining in a dramatic Gothic setting. Famous for seafood and game.",
    address: "Castlehill, Royal Mile",
    position: { x: "44%", y: "49%" },
    category: "Fine Dining",
    price: "£££",
    rating: 4.8,
    image: "/placeholder.svg",
    entryType: "reservation-recommended"
  },
  {
    id: "food-2",
    type: "food",
    name: "Dishoom Edinburgh",
    description: "Bombay-style café serving delicious Indian cuisine in a vibrant atmosphere.",
    address: "3A St Andrew Square",
    position: { x: "48%", y: "42%" },
    category: "Indian",
    price: "££",
    rating: 4.6,
    image: "/placeholder.svg",
    entryType: "walk-in"
  },
  {
    id: "food-3",
    type: "food",
    name: "Oink Victoria Street",
    description: "Authentic Scottish hog roast served in fresh bread rolls. Simple and delicious.",
    address: "38 Victoria Street",
    position: { x: "45%", y: "51%" },
    category: "Street Food",
    price: "£",
    rating: 4.7,
    image: "/placeholder.svg",
    entryType: "walk-in"
  },
  {
    id: "food-4",
    type: "food",
    name: "The Scran & Scallie",
    description: "Modern Scottish gastropub by Michelin-starred chefs. Seasonal, locally-sourced menu.",
    address: "1 Comely Bank Road",
    position: { x: "35%", y: "32%" },
    category: "Gastropub",
    price: "££",
    rating: 4.5,
    image: "/placeholder.svg",
    entryType: "reservation-recommended"
  },
  {
    id: "food-5",
    type: "food",
    name: "Makars Gourmet Mash Bar",
    description: "Creative takes on Scottish comfort food. Famous for gourmet mash combinations.",
    address: "74 Mound Place",
    position: { x: "43%", y: "47%" },
    category: "Scottish",
    price: "££",
    rating: 4.4,
    image: "/placeholder.svg",
    entryType: "walk-in"
  }
];

export const cafesMarkers: MapMarker[] = [
  {
    id: "cafe-1",
    type: "cafes",
    name: "The Elephant House",
    description: "Historic café where J.K. Rowling wrote Harry Potter. Excellent coffee and cakes.",
    address: "21 George IV Bridge",
    position: { x: "45%", y: "52%" },
    category: "Historic Café",
    price: "££",
    rating: 4.3,
    image: "/placeholder.svg",
    entryType: "walk-in"
  },
  {
    id: "cafe-2",
    type: "cafes",
    name: "Brew Lab Coffee",
    description: "Specialty coffee roastery with minimalist aesthetic. Perfect for coffee enthusiasts.",
    address: "6-8 South College Street",
    position: { x: "46%", y: "54%" },
    category: "Specialty Coffee",
    price: "££",
    rating: 4.7,
    image: "/placeholder.svg",
    entryType: "walk-in"
  },
  {
    id: "cafe-3",
    type: "cafes",
    name: "Peter's Yard",
    description: "Swedish-style bakery café known for sourdough and cinnamon buns.",
    address: "27 Simpson Loan",
    position: { x: "44%", y: "58%" },
    category: "Bakery",
    price: "££",
    rating: 4.6,
    image: "/placeholder.svg",
    entryType: "walk-in"
  },
  {
    id: "cafe-4",
    type: "cafes",
    name: "Söderberg Pavilion",
    description: "Scandinavian bakery and café in the heart of the city. Great for brunch.",
    address: "27 Simpson Loan",
    position: { x: "42%", y: "44%" },
    category: "Scandinavian",
    price: "££",
    rating: 4.5,
    image: "/placeholder.svg",
    entryType: "reservation-recommended"
  },
  {
    id: "cafe-5",
    type: "cafes",
    name: "Caffè Nero - Royal Mile",
    description: "Reliable Italian-style coffee chain in a historic building on the Royal Mile.",
    address: "80 High Street",
    position: { x: "48%", y: "51%" },
    category: "Chain Café",
    price: "£",
    rating: 4.2,
    image: "/placeholder.svg",
    entryType: "walk-in"
  }
];
