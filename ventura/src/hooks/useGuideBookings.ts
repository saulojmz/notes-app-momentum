import { useState, useEffect, useCallback } from 'react';
import { GuideBooking } from '@/types/guide';

const STORAGE_KEY = 'ventura_guide_bookings';
const CHANGE_EVENT = 'ventura:bookings-changed';

const read = (): GuideBooking[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    // Convert date strings back to Date objects
    return JSON.parse(stored).map((booking: GuideBooking) => ({
      ...booking,
      date: new Date(booking.date),
      createdAt: new Date(booking.createdAt),
    }));
  } catch (e) {
    console.error('Failed to load bookings:', e);
    return [];
  }
};

const write = (bookings: GuideBooking[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  // Keep every mounted instance of this hook in sync (e.g. the Guides page
  // behind the booking modal).
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const useGuideBookings = () => {
  const [bookings, setBookings] = useState<GuideBooking[]>(read);

  useEffect(() => {
    const sync = () => setBookings(read());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const createBooking = useCallback((booking: Omit<GuideBooking, 'id' | 'createdAt'>) => {
    const newBooking: GuideBooking = {
      ...booking,
      id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      createdAt: new Date(),
    };
    write([newBooking, ...read()]);
    return newBooking;
  }, []);

  const getBookings = () => bookings;

  const getUpcomingBookings = () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return bookings.filter(
      (b) => new Date(b.date) >= startOfToday && (b.status === 'confirmed' || b.status === 'upcoming'),
    );
  };

  const updateBookingStatus = useCallback((id: string, status: GuideBooking['status']) => {
    write(read().map((b) => (b.id === id ? { ...b, status } : b)));
  }, []);

  return {
    bookings,
    createBooking,
    getBookings,
    getUpcomingBookings,
    updateBookingStatus,
  };
};
