import { useCallback, useEffect, useState } from "react";
import { Hotspot, RectangleState } from "../types";
import {
  calculateRectangleBounds,
  createRectangleHotspot,
  getPercentageCoordinates,
  isValidRectangle,
} from "../utils";

export const useRectangleDrawing = (
  imageRef: React.RefObject<HTMLImageElement | null>,
  hotspots: Hotspot[],
  setHotspots: React.Dispatch<React.SetStateAction<Hotspot[]>>,
) => {
  const [rectangleState, setRectangleState] = useState<RectangleState>({
    isDrawing: false,
    start: null,
    current: null,
  });

  const startRectangleDrawing = useCallback((x: number, y: number) => {
    setRectangleState({
      isDrawing: true,
      start: { x, y },
      current: { x, y, width: 0, height: 0 },
    });
  }, []);

  const updateRectangleDrawing = useCallback(
    (currentX: number, currentY: number) => {
      if (!rectangleState.start) return;

      const bounds = calculateRectangleBounds(
        rectangleState.start.x,
        rectangleState.start.y,
        currentX,
        currentY,
      );

      setRectangleState((prev) => ({
        ...prev,
        current: bounds,
      }));
    },
    [rectangleState.start],
  );

  const finishRectangleDrawing = useCallback(() => {
    if (
      rectangleState.isDrawing &&
      rectangleState.current &&
      rectangleState.start
    ) {
      const { x, y, width, height } = rectangleState.current;

      if (isValidRectangle(width, height)) {
        const newHotspot = createRectangleHotspot(
          x,
          y,
          width,
          height,
          hotspots,
        );
        setHotspots((prev) => [...prev, newHotspot]);
      }
    }

    setRectangleState({
      isDrawing: false,
      start: null,
      current: null,
    });
  }, [rectangleState, hotspots, setHotspots]);

  // Handle mouse events for rectangle drawing
  useEffect(() => {
    if (!rectangleState.isDrawing || !imageRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current || !rectangleState.start) return;

      const coords = getPercentageCoordinates(
        e.clientX,
        e.clientY,
        imageRef.current,
      );
      updateRectangleDrawing(coords.x, coords.y);
    };

    const handleMouseUp = () => {
      finishRectangleDrawing();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    rectangleState.isDrawing,
    rectangleState.start,
    imageRef,
    updateRectangleDrawing,
    finishRectangleDrawing,
  ]);

  return {
    isDrawingRectangle: rectangleState.isDrawing,
    currentRectangle: rectangleState.current,
    startRectangleDrawing,
  };
};
