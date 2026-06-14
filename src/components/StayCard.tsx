import { Link } from "wouter";
import { Mountain, TreePine, Waves, Leaf, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StayCardProps {
  id: number;
  name: string;
  destinationName?: string;
  state: string;
  imageUrl: string;
  pricePerNight: number;
  ecoRating?: number;
  environment?: string;
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
}

export function StayCard({
  id,
  name,
  destinationName,
  state,
  imageUrl,
  pricePerNight,
  ecoRating = 0,
  environment,
  amenities = [],
}: StayCardProps) {
  const renderEnvironmentIcon = () => {
    switch (environment?.toLowerCase()) {
      case "mountains":
      case "mountain":
      case "valley":
        return <Mountain className="w-3 h-3 mr-1" />;
      case "forest":
        return <TreePine className="w-3 h-3 mr-1" />;
      case "river":
      case "lake":
      case "backwaters":
        return <Waves className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Link href={`/stays/${id}`} data-testid={`card-stay-${id}`} className="block relative h-[420px] w-full rounded-[24px] overflow-hidden group">
      <div className="absolute inset-0">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80'}
          alt={name}
          className="w-full h-[70%] object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {environment && (
        <Badge className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border-none">
          {renderEnvironmentIcon()}
          {environment}
        </Badge>
      )}

      <div className="absolute bottom-0 left-0 right-0 glass m-2 p-4 rounded-[20px] flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl font-bold text-foreground line-clamp-1 pr-2">{name}</h3>
          <div className="flex text-primary shrink-0 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Leaf
                key={star}
                className={`w-3 h-3 ${star <= ecoRating ? "fill-current" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1 shrink-0" />
          <span className="truncate">{destinationName ? `${destinationName}, ` : ""}{state}</span>
        </div>

        {amenities && amenities.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-1">
            {amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-end mt-2 pt-2 border-t border-black/5 dark:border-white/10">
          <div>
            <span className="text-xl font-bold text-foreground">₹{pricePerNight}</span>
            <span className="text-xs text-muted-foreground ml-1">/ night</span>
          </div>
          <span className="text-primary text-sm font-medium hover:underline">Explore →</span>
        </div>
      </div>
    </Link>
  );
}