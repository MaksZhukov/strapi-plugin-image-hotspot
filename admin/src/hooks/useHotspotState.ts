import { useCallback, useMemo, useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Hotspot, ImageHotspotValue } from "../types";
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
  const [imageData, setImageData] = useState<ImageHotspotValue["image"] | null>(
    initialValue?.image || null,
  );
  const previousValueRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  // Update parent form when value changes
  useEffect(() => {
    // Always send a value object when there's an image, null otherwise
    // This ensures the data structure is consistent

    const newValue: ImageHotspotValue | null = imageData
      ? {
          image: imageData,
          hotspots: hotspots || [],
        }
      : null;
    const newValueStr = JSON.stringify(newValue);

    // Skip onChange on initial mount to prevent form validation issues
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousValueRef.current = newValueStr;
      // Still send the initial value to ensure it's saved
      if (newValue !== null) {
        onChange({
          target: {
            name,
            value: newValue,
            type: "json",
          },
        });
      }
      return;
    }

    // Only call onChange if the value actually changed
    if (previousValueRef.current !== newValueStr) {
      previousValueRef.current = newValueStr;
      onChange({
        target: {
          name,
          value: newValue,
          type: "json",
        },
      });
    }
  }, [imageData, hotspots, name, onChange]);

  const handleImageRemove = useCallback(() => {
    setImageData(null);
    setHotspots([]);
  }, []);

  return {
    hotspots,
    setHotspots,
    imageData,
    setImageData,
    handleImageRemove,
  };
};
