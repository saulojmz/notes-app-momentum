import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LandmarkFact } from '@/types/camera';

interface FetchedImages {
  carouselImages: string[];
  factImages: Record<string, string>;
}

export const useLandmarkImages = (
  landmarkName: string,
  location: string,
  facts: LandmarkFact[]
) => {
  const [images, setImages] = useState<FetchedImages>({
    carouselImages: [],
    factImages: {},
  });
  const [isLoading, setIsLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const fetchImages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch carousel images for the landmark
        const carouselQuery = `${landmarkName} ${location} landmark`;
        const { data: carouselData, error: carouselError } = await supabase.functions.invoke(
          'fetch-unsplash-image',
          {
            body: { query: carouselQuery, count: 3 },
          }
        );

        if (carouselError) throw carouselError;

        const carouselUrls = carouselData?.images?.map((img: { imageUrl: string }) => img.imageUrl) || [];

        // Fetch fact images in parallel
        const factImagePromises = facts.map(async (fact) => {
          const factQuery = `${landmarkName} ${fact.title}`;
          const { data, error } = await supabase.functions.invoke('fetch-unsplash-image', {
            body: { query: factQuery, count: 1 },
          });

          if (error || !data?.images?.[0]) {
            return { id: fact.id, url: null };
          }

          return { id: fact.id, url: data.images[0].imageUrl };
        });

        const factResults = await Promise.all(factImagePromises);
        const factImagesMap: Record<string, string> = {};
        factResults.forEach((result) => {
          if (result.url) {
            factImagesMap[result.id] = result.url;
          }
        });

        setImages({
          carouselImages: carouselUrls,
          factImages: factImagesMap,
        });
      } catch (err) {
        console.error('Error fetching landmark images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [landmarkName, location, facts]);

  return { ...images, isLoading, error };
};
