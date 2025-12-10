import { Schema } from "@strapi/strapi";

export type HotspotType = "point" | "rectangle";

export type HotspotActionType =
  | "none"
  | "link"
  | "modal"
  | "tooltip"
  | "callback";

export interface HotspotAction {
  type: HotspotActionType;
  // For 'link' action
  url?: string;
  target?: "_self" | "_blank";
  // For 'modal' action
  modalTitle?: string;
  modalContent?: string;
  // For 'tooltip' action
  tooltipText?: string;
  // For 'callback' action
  callbackName?: string;
  callbackParams?: Record<string, any>;
  // For 'relation' action
  contentType?: string; // e.g., "api::article.article"
  entryId?: number | string;
}

export interface Hotspot {
  id: string;
  type: HotspotType;
  x: number; // percentage (0-100) - for point: center x, for rectangle: left x
  y: number; // percentage (0-100) - for point: center y, for rectangle: top y
  width?: number; // percentage (0-100) - only for rectangle
  height?: number; // percentage (0-100) - only for rectangle
  label?: string;
  action?: HotspotAction;
}

export interface Image {
  id: number;
  url?: string;
  formats?: {
    [key: string]: {
      url?: string;
    };
  };
  alternativeText?: string;
}

export interface ImageHotspotValue {
  image?: Image;
  hotspots?: Hotspot[];
}

export interface ImageHotspotProps {
  name: string;
  value?: ImageHotspotValue | null;
  onChange: (event: {
    target: { name: string; value: ImageHotspotValue | null; type?: string };
  }) => void;
  attribute: {
    required?: boolean;
    [key: string]: any;
  };
  intlLabel?: {
    id: string;
    defaultMessage: string;
  };
  error?: string;
  [key: string]: any;
}

export interface RectangleState {
  isDrawing: boolean;
  start: { x: number; y: number } | null;
  current: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}
