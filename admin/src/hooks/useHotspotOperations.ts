import { useCallback } from "react";
import { createPointHotspot } from "../utils";
import { Hotspot, HotspotAction } from "../types";

export const useHotspotOperations = (
  hotspots: Hotspot[],
  setHotspots: React.Dispatch<React.SetStateAction<Hotspot[]>>,
) => {
  const handleHotspotDelete = useCallback(
    (id: string) => {
      setHotspots((prev) => prev.filter((h) => h.id !== id));
    },
    [setHotspots],
  );

  const handleHotspotDrag = useCallback(
    (id: string, newX: number, newY: number) => {
      setHotspots((prev) =>
        prev.map((h) => {
          if (h.id !== id) return h;

          let updatedX: number;
          let updatedY: number;

          if (h.type === "point") {
            updatedX = Math.max(0, Math.min(100, newX));
            updatedY = Math.max(0, Math.min(100, newY));
          } else {
            // For rectangles, drag moves the top-left corner
            updatedX = Math.max(0, Math.min(100 - (h.width || 0), newX));
            updatedY = Math.max(0, Math.min(100 - (h.height || 0), newY));
          }

          // Only create a new object if coordinates actually changed
          if (h.x === updatedX && h.y === updatedY) {
            return h;
          }

          return {
            ...h,
            x: updatedX,
            y: updatedY,
          };
        }),
      );
    },
    [setHotspots],
  );

  const handleRectangleResize = useCallback(
    (id: string, newWidth: number, newHeight: number) => {
      setHotspots((prev) =>
        prev.map((h) =>
          h.id === id && h.type === "rectangle"
            ? {
                ...h,
                width: Math.max(1, Math.min(100 - h.x, newWidth)),
                height: Math.max(1, Math.min(100 - h.y, newHeight)),
              }
            : h,
        ),
      );
    },
    [setHotspots],
  );

  const handleActionUpdate = useCallback(
    (id: string, action: HotspotAction | undefined) => {
      setHotspots((prev) =>
        prev.map((h) => (h.id === id ? { ...h, action } : h)),
      );
    },
    [setHotspots],
  );

  const handleCreatePoint = useCallback(
    (x: number, y: number) => {
      const newHotspot = createPointHotspot(x, y, hotspots);
      console.log(newHotspot);
      setHotspots((prev) => [...prev, newHotspot]);
    },
    [hotspots, setHotspots],
  );

  return {
    handleHotspotDelete,
    handleHotspotDrag,
    handleRectangleResize,
    handleActionUpdate,
    handleCreatePoint,
  };
};
