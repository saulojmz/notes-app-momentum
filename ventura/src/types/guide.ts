export type VibeType = 'relaxed' | 'curious' | 'adventurous';
export type BookingStatus = 'confirmed' | 'upcoming' | 'completed';

export interface MeetupLocation {
  id: string;
  name: string;
  address: string;
  position: {
    x: string; // percentage
    y: string; // percentage
  };
}

export interface BookingPreferences {
  vibe: VibeType;
  activity: string;
  userEnergy: number; // 1-5
  companionEnergy: number; // 1-5
  notes?: string;
}

export interface Guide {
  id: string;
  name: string;
  avatar: string; // Unsplash URL
  bio: string; // includes hourly rate in text
  hourlyRate: number; // actual rate for calculations
  rating: number;
  reviews: number;
  specialties: string[];
  languages: string[];
  available: boolean;
  location: string;
}

export interface GuideBooking {
  id: string;
  guideId: string;
  guideName: string;
  guideAvatar: string;
  date: Date;
  time: string;
  duration: number; // hours
  partySize: number;
  meetupLocation: MeetupLocation;
  preferences: BookingPreferences;
  totalCost: number;
  status: BookingStatus;
  createdAt: Date;
}
