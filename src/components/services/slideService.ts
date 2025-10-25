// src/components/services/slideService.ts
import axios from "axios";

const API_URL =
  "https://drupal-cms.vinux.in/jsonapi/node/slides?include=field_card_images.field_media_image";

export interface Slide {
  id: string;
  title: string;
  allImages: string[];
}

export const fetchSlides = async (): Promise<Slide[]> => {
  try {
    const response = await axios.get(API_URL);
    console.log("Raw API response:", response.data); // 👈 Add this

    const { data, included } = response.data;
    if (!data || !Array.isArray(data)) {
      console.error("Unexpected API structure:", response.data);
      return [];
    }

    const slides: Slide[] = data.map((item: any) => {
      const title = item.attributes.title || "Untitled Slide";

      const allImages: string[] =
        (item.relationships.field_card_images?.data || []).map((mediaRef: any) => {
          const media = included.find(
            (inc: any) => inc.type === "media--image" && inc.id === mediaRef.id
          );

          if (!media) return "/placeholder.jpg";

          const file = included.find(
            (inc: any) =>
              inc.type === "file--file" &&
              inc.id === media.relationships.field_media_image?.data?.id
          );

          return file
            ? `https://drupal-cms.vinux.in${file.attributes.uri.url}`
            : "/placeholder.jpg";
        });

      return { id: item.id, title, allImages };
    });

    console.log("Slides:", slides);
    return slides;
  } catch (error: any) {
    console.error("Error fetching slides:", error.response?.data || error.message);
    throw error;
  }
};