import { Link } from "wouter";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DestinationCardProps {
  id: number;
  name: string;
  state: string;
  tagline: string;
  imageUrl: string;
  tags?: string[];
  isHiddenGem?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
}

export function DestinationCard({
  id,
  name,
  state,
  tagline,
  imageUrl,
  tags = [],
  isHiddenGem,
  rating,
}: DestinationCardProps) {
  return (
    <Link href={`/destinations/${id}`} data-testid={`card-destination-${id}`} className="block relative h-[400px] w-full rounded-[24px] overflow-hidden cursor-pointer group">
      <div className="absolute inset-0">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80'}
          alt={name}
          className="w-full h-[80%] object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      {isHiddenGem && (
        <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md border-none">
          Hidden Gem
        </Badge>
      )}

      <div className="absolute bottom-0 left-0 right-0 glass m-2 p-4 rounded-[20px] flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <h3 className="font-serif text-xl font-bold text-foreground line-clamp-1">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 mr-1 shrink-0" />
              <span className="truncate">{state}</span>
            </div>
          </div>
          {rating && (
            <div className="flex items-center text-amber-500 text-sm font-medium bg-white/50 px-2 py-1 rounded-full shrink-0">
              <Star className="w-3 h-3 fill-current mr-1" />
              {rating}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{tagline}</p>
        {tags && tags.length > 0 && (
          <div className="flex gap-2 mt-1 overflow-hidden">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-wider bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}