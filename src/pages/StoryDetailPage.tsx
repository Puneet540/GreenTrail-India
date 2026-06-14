import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { useGetStory, useListStories } from "@/lib/mockHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2, MapPin } from "lucide-react";

export default function StoryDetailPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  
  const { data: story, isLoading } = useGetStory(id);
  
  const { data: relatedStories } = useListStories(story?.destination ? { destination: story.destination } : undefined);
  const otherStories = relatedStories?.filter(s => s.id !== id).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-[60vh]" />
        <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-10">
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-5/6 mb-4" />
          <Skeleton className="h-8 w-4/6" />
        </div>
      </div>
    );
  }

  if (!story) return <div className="pt-32 text-center">Story not found.</div>;

  return (
    <div className="min-h-screen pb-24 bg-background" data-testid={`story-detail-${story.id}`}>
      <div className="relative h-[65vh] w-full">
        <img 
          src={story.imageUrl || "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=1600"} 
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-24 left-4 md:left-8 z-20">
          <Link href="/stories" className="inline-flex items-center text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-10 max-w-5xl mx-auto">
          {story.destination && (
            <Badge className="bg-primary hover:bg-primary/90 text-white mb-6 px-4 py-1.5 text-sm border-none shadow-lg">
              <MapPin className="w-4 h-4 mr-1 inline" /> {story.destination}
            </Badge>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">{story.title}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-serif text-xl border border-white/30">
              {story.authorName?.charAt(0) || "U"}
            </div>
            <div>
              <div className="font-medium text-lg">{story.authorName || "Explorer"}</div>
              <div className="text-sm opacity-80">{format(new Date(story.createdAt || new Date()), "MMMM d, yyyy")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex justify-end gap-4 mb-8">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" /> {story.likes || 0}
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" /> Share
          </button>
        </div>

        <div className="prose prose-lg md:prose-xl prose-stone max-w-none">
          {story.content.split('\n').map((paragraph, i) => (
            paragraph.trim() ? <p key={i} className="mb-6 leading-relaxed text-foreground/80">{paragraph}</p> : null
          ))}
        </div>

        {story.tags && story.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
            {story.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="bg-primary/5 text-primary text-sm py-1.5 px-4 rounded-full border-primary/20">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {otherStories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24 pt-16 border-t border-border">
          <h3 className="text-3xl font-serif text-primary mb-8">More from this region</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherStories.map((related) => (
              <Link key={related.id} href={`/stories/${related.id}`}>
                <div className="glass rounded-[24px] overflow-hidden group cursor-pointer h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={related.imageUrl || "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800"} 
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-xl font-serif text-primary mb-2 line-clamp-2">{related.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{related.content}</p>
                    <div className="text-xs font-medium uppercase tracking-wider text-primary">Read Story →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
