// src/components/services/slideService.ts
import axios from "axios";
import { cleanHtmlContent } from '@/lib/htmlUtils';

const API_URL =
  "https://drupal-cms.vinux.in/jsonapi/node/slides?include=field_card_images.field_media_image";

interface ApiResponse {
  data: SlideItem[];
  included: IncludedItem[];
}

interface SlideItem {
  id: string;
  attributes: {
    title: string;
  };
  relationships: {
    field_card_images?: {
      data: MediaRef[];
    };
  };
}

interface MediaRef {
  id: string;
  type: string;
}

interface IncludedItem {
  id: string;
  type: string;
  relationships?: {
    field_media_image?: {
      data?: {
        id: string;
      };
    };
  };
  attributes?: {
    uri: {
      url: string;
    };
  };
}

export interface Slide {
  id: string;
  title: string;
  allImages: string[];
}

export const fetchSlides = async (): Promise<Slide[]> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    console.log("Raw API response:", response.data);

    const { data, included } = response.data;
    if (!data || !Array.isArray(data)) {
      console.error("Unexpected API structure:", response.data);
      return [];
    }

    const slides: Slide[] = data.map((item: SlideItem) => {
      const title = cleanHtmlContent(item.attributes.title || "Untitled Slide");

      const allImages: string[] =
        (item.relationships.field_card_images?.data || []).map((mediaRef: MediaRef) => {
          const media = included.find(
            (inc: IncludedItem) => inc.type === "media--image" && inc.id === mediaRef.id
          );

          if (!media) return "/placeholder.jpg";

          const file = included.find(
            (inc: IncludedItem) =>
              inc.type === "file--file" &&
              inc.id === media.relationships?.field_media_image?.data?.id
          );

          return file
            ? `https://drupal-cms.vinux.in${file.attributes?.uri.url}`
            : "/placeholder.jpg";
        });

      return { id: item.id, title, allImages };
    });

    console.log("Slides:", slides);
    return slides;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error fetching slides:", errorMessage);
    throw error;
  }
};