import { addDays } from "date-fns";
import { itineraries } from "@/data/mockItineraries";
import { europeanLandmarks } from "@/data/europeanLandmarks";
import { meetupLocations, mockGuides } from "@/data/mockGuides";
import { readSavedTrips, saveTrip } from "@/features/planner/trips";
import type { PlannedTrip } from "@/features/planner/types";
import type { ItineraryDay, ItineraryStop } from "@/types/itinerary";
import { storage } from "@/lib/storage";
import { seedInbox } from "./inbox";
import { isoDay } from "./schedule";

/**
 * Sample data shared by both apps: a trip that is happening now (Edinburgh,
 * shown as Today on the phone) and one coming up (Prague, being planned on
 * desktop), plus a few things saved on the phone. Seeded once per browser;
 * "Reset data" in the prototype clears it and it comes back fresh.
 */
const SEED_KEY = "ventura_seed";
const SEED_VERSION = "3";

const base = (id: string) => itineraries.find((i) => i.id === id)!;
const stop = (s: ItineraryStop, patch: Partial<ItineraryStop>): ItineraryStop => ({ ...s, ...patch });

const edinburghTrip = (start: Date): PlannedTrip => {
  const src = base("edinburgh-historic-3day");
  const [d1, d2, d3] = src.days;
  const days: ItineraryDay[] = [
    {
      dayNumber: 1,
      title: "Old Town and the castle",
      stops: [
        stop(d1.stops[0], { time: "10:45", cost: 21, done: true }),
        stop(d1.stops[1], { time: "13:30", cost: 0, done: true }),
        stop(d1.stops[2], { time: "15:30", cost: 9, name: "Tea at The Elephant House", done: true }),
      ],
    },
    {
      dayNumber: 2,
      title: "Arthur's Seat and Holyrood",
      stops: [
        stop(d2.stops[0], { time: "08:00", cost: 0, name: "Arthur's Seat hike", done: true }),
        stop(d2.stops[1], { time: "11:30", cost: 21, note: "Tickets on my phone. Entrance on Canongate" }),
        {
          id: "stop-sheep-heid",
          name: "Lunch at The Sheep Heid Inn",
          time: "13:30",
          duration: "1.5 hours",
          description: "Scotland's oldest surviving pub, on the far side of Holyrood Park in Duddingston village",
          category: "Food",
          coordinates: { lat: 55.9413, lng: -3.1466 },
          tips: "Ask for a table in the courtyard if it's dry",
          cost: 24,
        },
        {
          id: "stop-ghost-tour",
          name: "Ghost tour: Underground Vaults",
          time: "21:00",
          duration: "1.5 hours",
          description: "Lantern-lit tour of the vaults under South Bridge, the city's most haunted address",
          category: "Nightlife",
          coordinates: { lat: 55.9497, lng: -3.1873 },
          tips: "Meet at the Blair Street entrance ten minutes early",
          cost: 18,
        },
      ],
    },
    {
      dayNumber: 3,
      title: "New Town and whisky",
      stops: [
        stop(d3.stops[0], { time: "10:00", cost: 0 }),
        stop(d3.stops[1], { time: "14:00", cost: 25 }),
        {
          id: "stop-dishoom",
          name: "Dinner at Dishoom",
          time: "18:00",
          duration: "1.5 hours",
          description: "Bombay café in a former department store on St Andrew Square",
          category: "Food",
          coordinates: { lat: 55.9541, lng: -3.1925 },
          cost: 32,
        },
      ],
    },
  ];
  return {
    ...src,
    id: "trip-edinburgh",
    planned: true,
    source: "custom",
    title: "Edinburgh long weekend",
    description: "Castle and Old Town first, Arthur's Seat at sunrise, then Georgian streets and a whisky to finish.",
    author: { name: "Alex Turner", avatar: "" },
    destinationName: "Edinburgh",
    country: "Scotland",
    summary: "Three days of castles, hills and closes",
    housing: [],
    keyActivities: ["Edinburgh Castle", "Arthur's Seat", "Underground Vaults"],
    days,
    duration: days.length,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    startDate: isoDay(addDays(start, -1)),
    currency: "£",
    stays: [{ id: "stay-grassmarket", name: "The Grassmarket Hotel", area: "Old Town", fromDay: 1, nights: 2, pricePerNight: 112 }],
    transport: [
      { id: "leg-out", mode: "train", from: "London King's Cross", to: "Edinburgh Waverley", day: 1, time: "05:40", price: 62 },
      { id: "leg-back", mode: "train", from: "Edinburgh Waverley", to: "London King's Cross", day: 3, time: "20:30", price: 58 },
    ],
  };
};

const pragueTrip = (start: Date): PlannedTrip => {
  const src = base("prague-classic-3day");
  const costs: Record<string, number> = {
    "Lunch at Lokál Dlouhá": 14,
    "Prague Castle": 17,
    "Lunch at U Zlaté Studně": 38,
    "Vltava River Cruise": 22,
    "Beer Garden at Letná Park": 8,
  };
  return {
    ...src,
    id: "trip-prague",
    planned: true,
    source: "custom",
    title: "Prague in spring",
    author: { name: "Alex Turner", avatar: "" },
    destinationName: "Prague",
    country: "Czech Republic",
    summary: "Spires, the castle district and long evenings in Letná",
    housing: [],
    keyActivities: ["Charles Bridge", "Prague Castle", "Letná beer garden"],
    days: src.days.map((d) => ({ ...d, stops: d.stops.map((s) => ({ ...s, cost: costs[s.name] ?? 0 })) })),
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    startDate: isoDay(addDays(start, 131)),
    currency: "£",
    stays: [{ id: "stay-agnes", name: "Residence Agnes", area: "Old Town", fromDay: 1, nights: 3, pricePerNight: 98 }],
    transport: [{ id: "leg-fly", mode: "flight", from: "London Heathrow", to: "Prague", day: 1, time: "07:10", price: 84 }],
  };
};

export const ensureSeed = () => {
  if (storage.getRaw(SEED_KEY) === SEED_VERSION) return;
  const today = new Date();
  const mine = readSavedTrips().filter((t) => t.id !== "trip-edinburgh" && t.id !== "trip-prague");
  storage.set("ventura_saved_trips", mine);
  saveTrip(pragueTrip(today));
  saveTrip(edinburghTrip(today));

  const calton = europeanLandmarks.find((l) => l.name === "Calton Hill");
  const now = Date.now();
  seedInbox([
    {
      id: "inbox-calton",
      kind: "landmark",
      name: "Calton Hill",
      detail: "Monuments and the best view of the Old Town skyline",
      city: "Edinburgh",
      category: "History",
      source: "Camera",
      savedAt: now - 1000 * 60 * 50,
      image: calton?.capturedImageUrl,
      coordinates: { lat: 55.9553, lng: -3.1826 },
    },
    {
      id: "inbox-oink",
      kind: "food",
      name: "Oink Victoria Street",
      detail: "Hog roast rolls on Victoria Street",
      city: "Edinburgh",
      category: "Food",
      source: "Map",
      savedAt: now - 1000 * 60 * 60 * 3,
      coordinates: { lat: 55.9486, lng: -3.1935 },
      cost: 8,
    },
    {
      id: "inbox-market",
      kind: "event",
      name: "Farmers Market at Castle Terrace",
      detail: "Saturdays, 9:00 AM – 3:00 PM",
      city: "Edinburgh",
      category: "Food",
      source: "Map",
      savedAt: now - 1000 * 60 * 60 * 26,
      coordinates: { lat: 55.9469, lng: -3.2033 },
    },
  ]);
  // A guide booked for tomorrow (day 3), so both apps have one to show.
  const sophie = mockGuides[0];
  const spot = meetupLocations.find((l) => l.name.startsWith("Calton")) ?? meetupLocations[0];
  const tomorrow = addDays(today, 1);
  tomorrow.setHours(14, 0, 0, 0);
  if (!storage.get<unknown[]>("ventura_guide_bookings", []).length) {
    storage.set("ventura_guide_bookings", [
      {
        id: "booking-seed-sophie",
        guideId: sophie.id,
        guideName: sophie.name,
        guideAvatar: sophie.avatar,
        date: tomorrow,
        time: "2:00 PM",
        duration: 2,
        partySize: 1,
        meetupLocation: spot,
        preferences: { vibe: "curious", activity: "Hidden Gems", userEnergy: 3, companionEnergy: 3 },
        totalCost: sophie.hourlyRate * 2,
        status: "confirmed",
        createdAt: new Date(now - 1000 * 60 * 60 * 30),
      },
    ]);
  }
  storage.setRaw(SEED_KEY, SEED_VERSION);
};
