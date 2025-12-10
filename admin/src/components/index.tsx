import React, { useState, useCallback, useRef } from "react";
import { useIntl } from "react-intl";
import { Box, Typography, Field } from "@strapi/design-system";
import type { HotspotType, ImageHotspotProps } from "../types";
import { useStrapiApp } from "@strapi/strapi/admin";
import { ImageSelector } from "./ImageSelector";
import { HotspotEditor } from "./HotspotEditor";
import { HotspotList } from "./HotspotList";
import {
  useHotspotState,
  useRectangleDrawing,
  useHotspotOperations,
} from "../hooks";
import { getPercentageCoordinates, isMarkerElement } from "../utils";

const ImageHotspot: React.FC<ImageHotspotProps> = ({
  name,
  value,
  onChange,
  attribute,
  error,
}) => {
  const MediaLibrary = useStrapiApp(
    "media-library",
    (state: any) => state.components["media-library"],
  );
  const { formatMessage } = useIntl();
  const imageRef = useRef<HTMLImageElement>(null);
  const [selectionMode, setSelectionMode] = useState<HotspotType>("point");
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  // Manage hotspot and image state
  const { hotspots, setHotspots, imageData, setImageData, handleImageRemove } =
    useHotspotState(value, name, onChange);

  // Manage rectangle drawing
  const { isDrawingRectangle, currentRectangle, startRectangleDrawing } =
    useRectangleDrawing(imageRef, hotspots, setHotspots);

  // Manage hotspot operations
  const {
    handleHotspotDelete,
    handleHotspotDrag,
    handleRectangleResize,
    handleActionUpdate,
    handleCreatePoint,
  } = useHotspotOperations(hotspots, setHotspots);

  const handleSelectAssets = useCallback(
    (assets: any[]) => {
      if (assets && assets.length > 0) {
        const asset = assets[0];
        setImageData(asset);
      }
      setIsMediaLibraryOpen(false);
    },
    [setImageData],
  );

  const handleCloseMediaLibrary = useCallback(() => {
    setIsMediaLibraryOpen(false);
  }, []);

  const handleImageMouseDown = useCallback(
    (event: React.MouseEvent<HTMLImageElement>) => {
      if (!imageRef.current) return;

      // Check if the click target is actually the image, not a marker
      const target = event.target as HTMLElement;
      if (target !== imageRef.current && isMarkerElement(target)) {
        return; // Click was on a marker, not the image
      }

      event.preventDefault();
      event.stopPropagation();

      const coords = getPercentageCoordinates(
        event.clientX,
        event.clientY,
        imageRef.current,
      );

      if (selectionMode === "point") {
        handleCreatePoint(coords.x, coords.y);
      } else if (selectionMode === "rectangle") {
        startRectangleDrawing(coords.x, coords.y);
      }
    },
    [selectionMode, handleCreatePoint, startRectangleDrawing],
  );

  const imageUrl = imageData?.url;

  return (
    <Box>
      <Field.Label marginBottom={1}>{name}</Field.Label>
      <Box
        borderWidth="1px"
        borderStyle="solid"
        borderColor="neutral200"
        borderRadius="4px"
        padding={4}
      >
        <ImageSelector
          imageData={imageData || null}
          onSelectImage={() => setIsMediaLibraryOpen(true)}
          onRemoveImage={handleImageRemove}
          isMediaLibraryOpen={isMediaLibraryOpen}
          MediaLibrary={MediaLibrary}
          onCloseMediaLibrary={handleCloseMediaLibrary}
          onSelectAssets={handleSelectAssets}
        />

        {imageData && (
          <>
            <HotspotEditor
              imageUrl={imageUrl || ""}
              imageData={imageData}
              hotspots={hotspots}
              selectionMode={selectionMode}
              isDrawingRectangle={isDrawingRectangle}
              currentRectangle={currentRectangle}
              error={error}
              imageRef={imageRef}
              onImageMouseDown={handleImageMouseDown}
              onHotspotDrag={handleHotspotDrag}
              onRectangleResize={handleRectangleResize}
              onSelectionModeChange={setSelectionMode}
            />
            <HotspotList
              hotspots={hotspots}
              onDelete={handleHotspotDelete}
              onActionUpdate={handleActionUpdate}
            />
          </>
        )}

        {error && (
          <Typography variant="pi" textColor="danger600" marginTop={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageHotspot;
