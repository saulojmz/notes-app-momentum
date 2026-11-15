type LatLng = { lat: number; lng: number };

/** Straight-line distance in metres. */
export const distanceM = (a: LatLng, b: LatLng) => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

/** Walking time at about 4.8 km/h, with a 1.3 detour factor for streets. */
export const walkMinutes = (a?: LatLng, b?: LatLng) => {
  if (!a || !b || (!a.lat && !a.lng) || (!b.lat && !b.lng)) return undefined;
  return Math.max(1, Math.round((distanceM(a, b) * 1.3) / 80));
};

export const formatWalk = (min?: number) =>
  min === undefined ? undefined : min > 60 ? `${Math.floor(min / 60)} h ${min % 60} min walk` : `${min} min walk`;

export const directionsUrl = (to: { name: string; coordinates?: LatLng; mapQuery?: string }) => {
  const dest = to.coordinates && (to.coordinates.lat || to.coordinates.lng) ? `${to.coordinates.lat},${to.coordinates.lng}` : to.mapQuery ?? to.name;
  return `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${encodeURIComponent(dest)}`;
};
