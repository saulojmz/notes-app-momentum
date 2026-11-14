import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/kit";

interface ProfileHeaderProps {
  username: string;
}

export const ProfileHeader = ({ username }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  return (
    <TopBar
      onBack={() => navigate(-1)}
      title={<span className="font-mono text-[13px] font-normal text-muted-foreground">@{username}</span>}
      right={
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} aria-label="Settings">
          <Settings className="!size-5" />
        </Button>
      }
    />
  );
};
