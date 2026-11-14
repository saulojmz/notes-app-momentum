import { useCallback, useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import type { AIItinerary, GuidedAnswers, PlannedTrip, TripCriteria } from "./types";

const SAVED_KEY = "ventura_saved_trips";
const DRAFTS_KEY = "ventura_trip_drafts";
const SESSION_KEY = "ventura_planner_session";
const GUIDED_KEY = "ventura_guided_draft";
const CHANGE = "ventura:trips-changed";

const emit = () => window.dispatchEvent(new Event(CHANGE));

const readSaved = () => storage.get<PlannedTrip[]>(SAVED_KEY, []);
const readDrafts = () => storage.get<PlannedTrip[]>(DRAFTS_KEY, []);

/** Keep generated-but-unsaved trips so their pages survive a refresh. */
export const rememberDrafts = (trips: PlannedTrip[]) => {
  const ids = new Set(trips.map((t) => t.id));
  storage.set(DRAFTS_KEY, [...trips, ...readDrafts().filter((t) => !ids.has(t.id))].slice(0, 40));
};

export const findTrip = (id?: string): PlannedTrip | undefined =>
  id ? readSaved().find((t) => t.id === id) ?? readDrafts().find((t) => t.id === id) : undefined;

export const isTripSaved = (id: string) => readSaved().some((t) => t.id === id);

export const saveTrip = (trip: PlannedTrip) => {
  storage.set(SAVED_KEY, [trip, ...readSaved().filter((t) => t.id !== trip.id)]);
  emit();
};

export const unsaveTrip = (id: string) => {
  storage.set(SAVED_KEY, readSaved().filter((t) => t.id !== id));
  emit();
};

/** Update a trip wherever it lives (saved list and/or drafts). */
export const updateTrip = (trip: PlannedTrip) => {
  const saved = readSaved();
  if (saved.some((t) => t.id === trip.id)) storage.set(SAVED_KEY, saved.map((t) => (t.id === trip.id ? trip : t)));
  storage.set(DRAFTS_KEY, readDrafts().map((t) => (t.id === trip.id ? trip : t)));
  emit();
};

/** Live view of saved trips. */
export const useSavedTrips = () => {
  const [saved, setSaved] = useState<PlannedTrip[]>(readSaved);
  useEffect(() => {
    const sync = () => setSaved(readSaved());
    window.addEventListener(CHANGE, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const isSaved = useCallback((id: string) => saved.some((t) => t.id === id), [saved]);
  return { saved, isSaved, save: saveTrip, unsave: unsaveTrip };
};

/** The last AI planning result, so the options screen works after a refresh. */
export interface PlannerSession {
  aiTripIds: string[];
  communityTripIds: string[];
  criteria: TripCriteria;
  provider: string;
  raw?: { ai: AIItinerary[] };
}
export const savePlannerSession = (s: PlannerSession) => storage.set(SESSION_KEY, s);
export const readPlannerSession = () => storage.get<PlannerSession | null>(SESSION_KEY, null);

/** Guided planner progress (auto-saved after every step). */
export interface GuidedDraft {
  step: number;
  answers: GuidedAnswers;
}
export const readGuidedDraft = () => storage.get<GuidedDraft | null>(GUIDED_KEY, null);
export const saveGuidedDraft = (d: GuidedDraft) => storage.set(GUIDED_KEY, d);
export const clearGuidedDraft = () => storage.remove(GUIDED_KEY);

/** The answers behind the latest guided results. */
const ANSWERS_KEY = "ventura_guided_answers";
export const saveGuidedAnswers = (a: GuidedAnswers) => storage.set(ANSWERS_KEY, a);
export const readGuidedAnswers = () => storage.get<GuidedAnswers | null>(ANSWERS_KEY, null);
