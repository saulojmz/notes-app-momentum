import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { itineraries, destinations } from "@/data/mockItineraries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Share } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "Alex Turner",
    username: "alex_turner",
    bio: "Solo Traveler | Exploring the world one city at a time 🌍",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profileData);

  // Load profile from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ventura_profile");
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfileData(parsed);
      setEditForm(parsed);
    }
  }, []);

  // Save profile to localStorage
  const handleSaveProfile = () => {
    localStorage.setItem("ventura_profile", JSON.stringify(editForm));
    setProfileData(editForm);
    setEditModalOpen(false);
  };

  // Filter user's posted itineraries (mock: where author name matches)
  const userPostedItineraries = itineraries.filter(
    (itinerary) => itinerary.author.name === "Alex. T" || itinerary.author.name === "Marie K." || itinerary.author.name === "Fiona M."
  );

  // Get saved itineraries from localStorage
  const [savedItineraryIds, setSavedItineraryIds] = useState<string[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem("ventura_saved_itineraries");
    if (stored) {
      setSavedItineraryIds(JSON.parse(stored));
    }
  }, []);

  const savedItineraries = itineraries.filter((itinerary) =>
    savedItineraryIds.includes(itinerary.id)
  );

  // Calculate stats
  const stats = {
    itineraries: userPostedItineraries.length,
    cities: 12, // Mock data
    saved: 45, // Mock data
  };

  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="min-h-screen">
      <ProfileHeader username={profileData.username} />

      <div className="mx-auto max-w-2xl space-y-6 px-5 pt-2">
        {/* Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-display bg-primary text-[30px] text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-display text-[34px]">{profileData.name}</h1>
              <p className="meta mt-1">@{profileData.username}</p>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/85">{profileData.bio}</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditModalOpen(true)}>
              Edit profile
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Share profile"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Profile link copied");
              }}
            >
              <Share />
            </Button>
          </div>
        </div>

        <ProfileStats itineraries={stats.itineraries} cities={stats.cities} saved={stats.saved} />

        <ProfileTabs postedItineraries={userPostedItineraries} savedItineraries={savedItineraries} />
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
