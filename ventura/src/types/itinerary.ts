export interface Destination {
  id: string;
  name: string;
  country: string;
  region: Region;
  description: string;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ItineraryStop {
  id: string;
  name: string;
  time: string;
  duration: string;
  description: string;
  category: CategoryFilter;
  coordinates: {
    lat: number;
    lng: number;
  };
  tips?: string;
  /** Free-text place for map links when coordinates are approximate. */
  mapQuery?: string;
  /** Planning extras: price per person, a note added on the go, and today's progress. */
  cost?: number;
  note?: string;
  skipped?: boolean;
  done?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  stops: ItineraryStop[];
}

export interface Itinerary {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  duration: number;
  category: CategoryFilter;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  imageUrl: string;
  days: ItineraryDay[];
}

export interface ItineraryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type CategoryFilter = "All" | "Food" | "Nightlife" | "Culture" | "Nature" | "Shopping" | "History";
export type Region = "All" | "Europe" | "Asia" | "Americas" | "Africa" | "Oceania";
