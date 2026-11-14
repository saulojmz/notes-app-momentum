import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kit";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <EmptyState
      className="min-h-[80vh] justify-center"
      icon={Compass}
      title="Off the map"
      description="We couldn't find that page. Let's get you back on route."
      action={
        <Button className="w-full" onClick={() => navigate("/map")}>
          Back to the map
        </Button>
      }
    />
  );
};

export default NotFound;
