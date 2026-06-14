import { Link } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background pt-20">
      <div className="relative mb-12">
        <div className="font-serif text-[200px] leading-none text-primary/8 select-none pointer-events-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-primary/60" />
          </div>
        </div>
      </div>
      <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">You've ventured off the map</h1>
      <p className="text-muted-foreground text-lg mb-10 max-w-md font-light">
        The trail you're looking for has grown over. Let's find you a path back to the wild.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button asChild className="btn-primary px-8 py-6 text-base">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="btn-secondary px-8 py-6 text-base">
          <Link href="/destinations">Explore Destinations</Link>
        </Button>
      </div>
    </div>
  );
}
