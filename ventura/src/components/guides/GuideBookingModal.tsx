import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ArrowLeft, X } from 'lucide-react';
import { Guide, MeetupLocation, BookingPreferences, GuideBooking } from '@/types/guide';
import { meetupLocations } from '@/data/mockGuides';
import { Button } from '@/components/ui/button';
import { SelectOptionStep } from './SelectOptionStep';
import { SchedulingStep } from './SchedulingStep';
import { MeetupSpotStep } from './MeetupSpotStep';
import { PreferencesStep } from './PreferencesStep';
import { AvailableGuidesStep } from './AvailableGuidesStep';
import { GuideProfileStep } from './GuideProfileStep';
import { BookingSummaryStep } from './BookingSummaryStep';
import { BookingConfirmedStep } from './BookingConfirmedStep';
import { useGuideBookings } from '@/hooks/useGuideBookings';
import { toast } from 'sonner';

interface GuideBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedGuide?: Guide;
}

type Step = 'select' | 'scheduling' | 'meetup' | 'preferences' | 'guides' | 'profile' | 'summary' | 'confirmed';

const STEP_ORDER: Step[] = ['select', 'scheduling', 'meetup', 'preferences', 'guides', 'profile', 'summary'];

const TITLES: Record<Step, string> = {
  select: 'Book a guide',
  scheduling: 'Schedule',
  meetup: 'Meeting point',
  preferences: "What's the vibe?",
  guides: 'Available companions',
  profile: 'Companion',
  summary: 'Review',
  confirmed: 'Confirmed',
};

export const GuideBookingModal = ({ open, onOpenChange, preSelectedGuide }: GuideBookingModalProps) => {
  const [step, setStep] = useState<Step>('select');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(preSelectedGuide || null);
  const [confirmedBooking, setConfirmedBooking] = useState<GuideBooking | null>(null);

  // Booking data
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(2);
  const [partySize, setPartySize] = useState<number>(1);
  const [meetupLocation, setMeetupLocation] = useState<MeetupLocation | null>(null);
  const [preferences, setPreferences] = useState<BookingPreferences | null>(null);
  const [meetNow, setMeetNow] = useState(false);
  const { createBooking } = useGuideBookings();

  const handleSelectMeetNow = () => {
    // "Meet now" skips scheduling + meetup: default to the nearest public spot.
    setMeetNow(true);
    setDate(new Date());
    setTime('ASAP');
    setDuration(1);
    setPartySize(1);
    setMeetupLocation(meetupLocations.find((l) => l.id === 'loc-3') ?? meetupLocations[0]);
    setStep('preferences');
  };

  const handleConfirmBooking = () => {
    if (!selectedGuide || !meetupLocation || !preferences) return;
    const totalCost = selectedGuide.hourlyRate * duration * partySize;
    const booking = createBooking({
      guideId: selectedGuide.id,
      guideName: selectedGuide.name,
      guideAvatar: selectedGuide.avatar,
      date,
      time,
      duration,
      partySize,
      meetupLocation,
      preferences,
      totalCost,
      status: 'confirmed',
    });
    setConfirmedBooking(booking);
    setStep('confirmed');
    toast.success('Booking confirmed', { description: `You're all set to meet ${selectedGuide.name}` });
  };

  const handleBack = () => {
    if (step === 'profile') return setStep('guides');
    if (step === 'summary') return setStep('guides');
    if (step === 'preferences' && meetNow) return setStep('select');
    const i = STEP_ORDER.indexOf(step);
    if (i > 0) setStep(STEP_ORDER[i - 1]);
  };

  const handleClose = () => {
    setStep('select');
    setSelectedGuide(preSelectedGuide || null);
    setConfirmedBooking(null);
    setDate(new Date());
    setTime('');
    setDuration(2);
    setPartySize(1);
    setMeetupLocation(null);
    setPreferences(null);
    setMeetNow(false);
    onOpenChange(false);
  };

  const canGoBack = step !== 'select' && step !== 'confirmed';
  const progressSteps = meetNow ? ['select', 'preferences', 'guides', 'summary'] : ['select', 'scheduling', 'meetup', 'preferences', 'guides', 'summary'];
  const progressIndex = step === 'profile' ? progressSteps.indexOf('guides') : step === 'confirmed' ? progressSteps.length - 1 : progressSteps.indexOf(step);
  const progress = step === 'confirmed' ? 1 : Math.max(0, progressIndex) / (progressSteps.length - 1);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleClose())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-background data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 data-[state=open]:duration-300"
        >
          {/* Header */}
          <header className="pt-safe shrink-0">
            <div className="flex h-16 items-center justify-between px-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={!canGoBack}
                aria-label="Back"
                className={canGoBack ? '' : 'invisible'}
              >
                <ArrowLeft className="!size-5" />
              </Button>
              <DialogPrimitive.Title className="text-[15px] font-semibold">
                {step === 'profile' && selectedGuide ? selectedGuide.name : TITLES[step]}
              </DialogPrimitive.Title>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
                <X className="!size-5" />
              </Button>
            </div>
            <div className="mx-5 h-[3px] overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${progress * 100}%` }} />
            </div>
          </header>

          {/* Content */}
          <div key={step} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden animate-fade-in">
            {step === 'select' && <SelectOptionStep onSelectSchedule={() => setStep('scheduling')} onSelectMeetNow={handleSelectMeetNow} onCheckBookings={handleClose} />}
            {step === 'scheduling' && (
              <SchedulingStep
                onNext={(d) => {
                  setMeetNow(false);
                  setDate(d.date);
                  setTime(d.time);
                  setDuration(d.duration);
                  setPartySize(d.partySize);
                  setStep('meetup');
                }}
              />
            )}
            {step === 'meetup' && (
              <MeetupSpotStep
                onNext={(location) => {
                  setMeetupLocation(location);
                  setStep('preferences');
                }}
              />
            )}
            {step === 'preferences' && (
              <PreferencesStep
                onNext={(prefs) => {
                  setPreferences(prefs);
                  setStep('guides');
                }}
              />
            )}
            {step === 'guides' && preferences && (
              <AvailableGuidesStep
                date={date}
                time={time}
                preferences={preferences}
                onSelectGuide={(g) => {
                  setSelectedGuide(g);
                  setStep('summary');
                }}
                onViewProfile={(g) => {
                  setSelectedGuide(g);
                  setStep('profile');
                }}
              />
            )}
            {step === 'profile' && selectedGuide && <GuideProfileStep guide={selectedGuide} onConfirm={() => setStep('summary')} />}
            {step === 'summary' && selectedGuide && meetupLocation && preferences && (
              <BookingSummaryStep
                guide={selectedGuide}
                date={date}
                time={time}
                duration={duration}
                partySize={partySize}
                meetupLocation={meetupLocation}
                preferences={preferences}
                onConfirm={handleConfirmBooking}
                onEdit={handleBack}
              />
            )}
            {step === 'confirmed' && confirmedBooking && <BookingConfirmedStep booking={confirmedBooking} onViewBookings={handleClose} />}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
