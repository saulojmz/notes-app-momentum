import { MoreHorizontal, Trash2 } from 'lucide-react';
import { SavedLandmark } from '@/types/camera';
import { SmartImage } from '@/components/kit';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SavedLandmarkCardProps {
  landmark: SavedLandmark;
  onClick: () => void;
  onRemove: () => void;
}

const timeAgo = (savedAt: number) => {
  const days = Math.floor((Date.now() - savedAt) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

export const SavedLandmarkCard = ({ landmark, onClick, onRemove }: SavedLandmarkCardProps) => (
  <div className="group relative">
    <button type="button" onClick={onClick} className="press block w-full text-left">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
        <SmartImage
          src={landmark.capturedImageUrl}
          alt={landmark.name}
          className="h-full w-full object-cover transition-transform duration-700"
        />
      </div>
      <div className="pt-2.5">
        <h3 className="text-title line-clamp-1 text-[17px]">{landmark.name}</h3>
        <p className="meta mt-0.5 truncate">
          {landmark.location} · {timeAgo(landmark.savedAt)}
        </p>
      </div>
    </button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Options for ${landmark.name}`}
          className="glass-dark absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
