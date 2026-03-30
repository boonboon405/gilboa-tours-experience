import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extrabold text-primary mb-4" style={{ fontFamily: 'Heebo, sans-serif' }}>
          404
        </p>
        <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Heebo, sans-serif' }}>
          הדף לא נמצא
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-[1.7]">
          Page not found — the page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button variant="hero" size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            חזרה לדף הבית / Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
