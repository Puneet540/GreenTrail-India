import { useEffect, useState } from "react";
import {
  getGooglePlacePhoto,
  fetchUnsplashImage,
} from "@/lib/imagesApi";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85";

const cache = new Map<string, string>();

export function useDestinationImage(
  destinationName: string,
  fallback?: string
) {
  const [imageUrl, setImageUrl] = useState(
    fallback || FALLBACK_IMAGE
  );

  useEffect(() => {
    let mounted = true;

    async function loadImage() {
      if (!destinationName) return;

      if (cache.has(destinationName)) {
        setImageUrl(cache.get(destinationName)!);
        return;
      }

      try {
        // 1. Google Places
        let image = await getGooglePlacePhoto(destinationName);

        // 2. Unsplash
        if (!image) {
          image = await fetchUnsplashImage(destinationName);
        }

        // 3. Fallback
        const finalImage =
          image || fallback || FALLBACK_IMAGE;

        cache.set(destinationName, finalImage);

        if (mounted) {
          setImageUrl(finalImage);
        }
      } catch {
        if (mounted) {
          setImageUrl(fallback || FALLBACK_IMAGE);
        }
      }
    }

    loadImage();

    return () => {
      mounted = false;
    };
  }, [destinationName, fallback]);

  return imageUrl;
}