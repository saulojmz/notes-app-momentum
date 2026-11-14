import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FilterItemImage {
  imageUrl: string;
  isLoading: boolean;
}

const imageCache = new Map<string, string>();

/**
 * Fetches a representative Unsplash photo for a map item via the
 * `fetch-unsplash-image` edge function. Without Supabase configured it
 * resolves immediately with an empty URL and callers show their fallback.
 */
export const useFilterItemImage = (itemName: string, category?: string): FilterItemImage => {
  const cacheKey = `${itemName}-${category}`;
  const [imageUrl, setImageUrl] = useState<string>(imageCache.get(cacheKey) ?? "");
  const [isLoading, setIsLoading] = useState(!!supabase && !imageCache.has(cacheKey) && !!itemName);

  useEffect(() => {
    if (!itemName) return;
    if (imageCache.has(cacheKey)) {
      setImageUrl(imageCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }
    if (!supabase) {
      setImageUrl("");
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const query = category ? `${itemName} ${category} Edinburgh Scotland` : `${itemName} Edinburgh Scotland`;

    supabase.functions
      .invoke("fetch-unsplash-image", { body: { query, count: 1 } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) throw error;
        const url = data?.images?.[0]?.imageUrl;
        if (url) {
          imageCache.set(cacheKey, url);
          setImageUrl(url);
        }
      })
      .catch((error) => console.error("Error fetching image for", itemName, error))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, [itemName, category, cacheKey]);

  return { imageUrl, isLoading };
};
