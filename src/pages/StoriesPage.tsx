import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useListStories, useListDestinations, useCreateStory } from "@/lib/mockHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MapPin, PenLine, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const storySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Story must be at least 50 characters"),
  destination: z.string().min(2, "Destination is required"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  tags: z.string().optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

export default function StoriesPage() {
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: stories, isLoading, refetch } = useListStories(
    selectedDestination !== "all" ? { destination: selectedDestination } : undefined
  );
  const { data: destinations } = useListDestinations();
  const createStory = useCreateStory();

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: { title: "", excerpt: "", content: "", destination: "", imageUrl: "", tags: "" },
  });

  const featuredStory = stories?.find((s) => s.isFeatured) || stories?.[0];
  const gridStories = stories?.filter((s) => s.id !== featuredStory?.id) || [];

  const onSubmitStory = (data: StoryFormData) => {
    const tags = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    createStory.mutate(
      {
        data: {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          destination: data.destination,
          imageUrl: data.imageUrl,
          tags,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Story shared!", description: "Your story is now live in the journal." });
          form.reset();
          setDialogOpen(false);
          refetch();
        },
        onError: () => {
          toast({ title: "Failed to share story", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80"
            alt="Forest"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">Shared Rhythms</h1>
          <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto font-light">
            Tales from the wild, told by those who wander it.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <h2 className="text-3xl font-serif text-primary">Discover Stories</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={selectedDestination} onValueChange={setSelectedDestination}>
              <SelectTrigger className="w-full sm:w-[220px] rounded-full bg-white/50 backdrop-blur-md border-primary/20">
                <SelectValue placeholder="Filter by destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {destinations?.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-[32px]" />
            ))}
          </div>
        ) : stories && stories.length > 0 ? (
          <>
            {featuredStory && selectedDestination === "all" && (
              <div className="mb-16">
                <div className="glass rounded-[32px] overflow-hidden flex flex-col md:flex-row group">
                  <div className="w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                    <img
                      src={featuredStory.imageUrl || "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800"}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    {featuredStory.destination && (
                      <Badge className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                        <MapPin className="w-3 h-3 mr-1 inline" /> {featuredStory.destination}
                      </Badge>
                    )}
                    <h3 className="text-4xl font-serif text-primary mb-4">{featuredStory.title}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3 text-lg">{featuredStory.content}</p>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-serif">
                        {featuredStory.authorName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-medium">{featuredStory.authorName || "Explorer"}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(featuredStory.createdAt || new Date()), "MMMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    <Link href={`/stories/${featuredStory.id}`} className="btn-primary w-fit px-8 py-3">
                      Read Story
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridStories.map((story) => (
                <Link key={story.id} href={`/stories/${story.id}`}>
                  <div
                    data-testid={`card-story-${story.id}`}
                    className="glass rounded-[32px] overflow-hidden h-full flex flex-col group hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={story.imageUrl || "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800"}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {story.destination && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-primary hover:bg-white border-none shadow-sm backdrop-blur-md">
                            {story.destination}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-serif text-primary mb-2 line-clamp-2">{story.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">{story.content}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-serif">
                            {story.authorName?.charAt(0) || "U"}
                          </div>
                          <span className="text-sm font-medium">{story.authorName?.split(" ")[0] || "User"}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Heart className="w-4 h-4 mr-1 text-red-400" /> {story.likes || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 glass rounded-[32px]">
            <h3 className="text-2xl font-serif text-primary mb-2">No stories found</h3>
            <p className="text-muted-foreground">Be the first to share your experience here.</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <button
            className="btn-primary px-10 py-4 text-lg shadow-lg inline-flex items-center gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <PenLine className="w-5 h-5" />
            Share Your Story
          </button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary">Share Your Story</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmitStory)} className="space-y-5 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Story Title</label>
              <Input
                {...form.register("title")}
                placeholder="A night under the stars at Spiti Valley"
                className="rounded-xl bg-muted/40 h-11"
              />
              {form.formState.errors.title && (
                <p className="text-destructive text-xs">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Short Excerpt</label>
              <Input
                {...form.register("excerpt")}
                placeholder="A one-sentence teaser for your story..."
                className="rounded-xl bg-muted/40 h-11"
              />
              {form.formState.errors.excerpt && (
                <p className="text-destructive text-xs">{form.formState.errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Your Story</label>
              <Textarea
                {...form.register("content")}
                placeholder="Tell us about your journey — the sights, sounds, and moments that moved you..."
                className="rounded-xl bg-muted/40 min-h-[150px] resize-none"
              />
              {form.formState.errors.content && (
                <p className="text-destructive text-xs">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Destination</label>
                <Input
                  {...form.register("destination")}
                  placeholder="Spiti Valley, Himachal Pradesh"
                  className="rounded-xl bg-muted/40 h-11"
                />
                {form.formState.errors.destination && (
                  <p className="text-destructive text-xs">{form.formState.errors.destination.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Tags (comma separated)</label>
                <Input
                  {...form.register("tags")}
                  placeholder="mountains, solo, wildlife"
                  className="rounded-xl bg-muted/40 h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Cover Image URL</label>
              <Input
                {...form.register("imageUrl")}
                placeholder="https://images.unsplash.com/..."
                className="rounded-xl bg-muted/40 h-11"
              />
              {form.formState.errors.imageUrl && (
                <p className="text-destructive text-xs">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                type="submit"
                disabled={createStory.isPending}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {createStory.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PenLine className="w-4 h-4" />
                )}
                Publish Story
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
