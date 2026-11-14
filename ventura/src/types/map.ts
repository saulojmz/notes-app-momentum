export type FilterType = 'safety' | 'events' | 'food' | 'cafes';

export type SafetyLevel = 'safe' | 'moderate' | 'dangerous';

export type TimeOfDay = 'day' | 'night';

export type EntryType = 'walk-in' | 'ticket-required' | 'reservation-recommended';

export interface SafetyZone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
  dayRisk: SafetyLevel;
  nightRisk: SafetyLevel;
  position: { x: string; y: string }; // Position on static map image
  size: { width: string; height: string };
}

export interface MapMarker {
  id: string;
  type: FilterType;
  name: string;
  description: string;
  address: string;
  position: { x: string; y: string }; // Position on static map image
  category?: string;
  date?: string;
  time?: string;
  price?: string;
  rating?: number;
  image?: string;
  entryType?: EntryType;
}

export type EventTimeFilter = 'today' | 'this-week' | 'weekend';
