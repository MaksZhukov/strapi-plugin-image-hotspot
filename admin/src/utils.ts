import type { Hotspot, HotspotType } from "./types";

/**
 * Clamps a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Converts mouse coordinates to percentage coordinates relative to an element
 */
export const getPercentageCoordinates = (
  clientX: number,
  clientY: number,
  element: HTMLElement,
): { x: number; y: number } => {
  const rect = element.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  return {
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
  };
};

/**
 * Generates a unique hotspot ID
 */
export const generateHotspotId = (): string => {
  return `hotspot-${Date.now()}-${Math.random()}`;
};

/**
 * Creates a new point hotspot
 */
export const createPointHotspot = (
  x: number,
  y: number,
  existingHotspots: Hotspot[],
): Hotspot => {
  const pointCount = existingHotspots.filter((h) => h.type === "point").length;
  return {
    id: generateHotspotId(),
    type: "point",
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
    label: `Point ${pointCount + 1}`,
  };
};

/**
 * Creates a new rectangle hotspot
 */
export const createRectangleHotspot = (
  x: number,
  y: number,
  width: number,
  height: number,
  existingHotspots: Hotspot[],
): Hotspot => {
  const rectangleCount = existingHotspots.filter(
    (h) => h.type === "rectangle",
  ).length;
  return {
    id: generateHotspotId(),
    type: "rectangle",
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
    width: clamp(width, 0, 100 - x),
    height: clamp(height, 0, 100 - y),
    label: `Rectangle ${rectangleCount + 1}`,
  };
};

/**
 * Normalizes hotspot data to ensure type is set
 */
export const normalizeHotspot = (hotspot: Hotspot): Hotspot => {
  return {
    ...hotspot,
    type: hotspot.type || "point",
  };
};

/**
 * Normalizes an array of hotspots
 */
export const normalizeHotspots = (hotspots: Hotspot[]): Hotspot[] => {
  return hotspots.map(normalizeHotspot);
};

/**
 * Checks if a click target is a marker element
 */
export const isMarkerElement = (target: HTMLElement): boolean => {
  const parent = target.closest('[style*="position: absolute"]');
  return parent !== null;
};

/**
 * Calculates rectangle bounds from start and current points
 */
export const calculateRectangleBounds = (
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
): { x: number; y: number; width: number; height: number } => {
  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  return {
    x: clamp(x, 0, 100),
    y: clamp(y, 0, 100),
    width: clamp(width, 0, 100 - x),
    height: clamp(height, 0, 100 - y),
  };
};

/**
 * Minimum size for a valid rectangle hotspot
 */
export const MIN_RECTANGLE_SIZE = 1;

/**
 * Checks if a rectangle has valid dimensions
 */
export const isValidRectangle = (width: number, height: number): boolean => {
  return width > MIN_RECTANGLE_SIZE && height > MIN_RECTANGLE_SIZE;
};
