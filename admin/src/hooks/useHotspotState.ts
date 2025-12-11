import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Hotspot, Image, ImageHotspotValue } from "../types";
import { normalizeHotspots } from "../utils";

export const useHotspotState = (
  initialValue: ImageHotspotValue | null | undefined,
  name: string,
  onChange: (event: {
    target: { name: string; value: ImageHotspotValue | null; type?: string };
  }) => void,
) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(
    initialValue?.hotspots ? normalizeHotspots(initialValue.hotspots) : [],
  );

  const [imageData, setImageData] = useState<Image | null>(null);
  const [imageId, setImageId] = useState<string | null>(
    initialValue?.image || null,
  );

  useEffect(() => {
    const fetchImageData = async () => {
      if (imageId && typeof imageId === "string") {
        try {
          const response = await fetch(
            `/api/upload/files?filters[documentId][$eq]=${imageId}`,
          );
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
              setImageData(data[0]);
            } else {
              throw new Error("Image not found");
            }
          } else {
            console.error("Failed to fetch image data:", response.statusText);
            setImageId(null);
            setImageData(null);
          }
        } catch (error) {
          setImageData(null);
        }
      }
    };

    fetchImageData();
  }, [imageId, name, onChange]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newValue: ImageHotspotValue | null = imageId
        ? {
            image: imageId,
            hotspots: hotspots || [],
          }
        : null;
      onChange({
        target: {
          name,
          value: newValue,
          type: "json",
        },
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [imageId, hotspots, name, onChange]);

  // When image is selected, extract the ID and store both ID and data
  const handleImageSet = useCallback((asset: Image) => {
    if (asset?.id) {
      setImageId(asset.documentId);
      setImageData(asset);
    }
  }, []);

  const handleImageRemove = useCallback(() => {
    setImageData(null);
    setImageId(null);
    setHotspots([]);
  }, []);

  return {
    hotspots,
    setHotspots,
    imageData,
    setImageData: handleImageSet,
    imageId,
    handleImageRemove,
  };
};
