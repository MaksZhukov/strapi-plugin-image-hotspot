import React, { RefObject } from "react";
import { useIntl } from "react-intl";
import { Box, Button, Flex, Typography } from "@strapi/design-system";
import styled from "styled-components";
import type { HotspotType, Hotspot } from "../types";
import { HotspotMarker } from "./HotspotMarker";
import { RectangleMarker } from "./RectangleMarker";

interface HotspotEditorProps {
  imageUrl: string;
  imageData: { id: number; url?: string; alternativeText?: string };
  hotspots: Hotspot[];
  selectionMode: HotspotType;
  isDrawingRectangle: boolean;
  currentRectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  error?: string;
  imageRef: RefObject<HTMLImageElement | null>;
  onImageMouseDown: (event: React.MouseEvent<HTMLImageElement>) => void;
  onHotspotDrag: (id: string, newX: number, newY: number) => void;
  onRectangleResize: (id: string, newWidth: number, newHeight: number) => void;
  onSelectionModeChange: (mode: HotspotType) => void;
}

interface ImageContainerProps {
  $position: string;
}

interface HotspotImageProps {
  $cursor: string;
  $zIndex: number;
}

interface DrawingRectangleProps {
  $x: number;
  $y: number;
  $width: number;
  $height: number;
  $zIndex: number;
}

const ImageContainer = styled.div<ImageContainerProps>`
  position: ${(props) => props.$position};
  display: inline-block;
  width: 100%;
`;

const HotspotImage = styled.img<HotspotImageProps>`
  width: 100%;
  height: auto;
  display: block;
  cursor: ${(props) => props.$cursor};
  user-select: none;
  pointer-events: auto;
  position: relative;
  z-index: ${(props) => props.$zIndex};
`;

const DrawingRectangle = styled.div<DrawingRectangleProps>`
  position: absolute;
  left: ${(props) => props.$x}%;
  top: ${(props) => props.$y}%;
  width: ${(props) => props.$width}%;
  height: ${(props) => props.$height}%;
  border: 2px dashed ${({ theme }) => theme.colors.primary600};
  background: rgba(0, 123, 255, 0.1);
  pointer-events: none;
  z-index: ${(props) => props.$zIndex};
`;

export const HotspotEditor: React.FC<HotspotEditorProps> = ({
  imageUrl,
  imageData,
  hotspots,
  selectionMode,
  isDrawingRectangle,
  currentRectangle,
  error,
  imageRef,
  onImageMouseDown,
  onHotspotDrag,
  onRectangleResize,
  onSelectionModeChange,
}) => {
  const { formatMessage } = useIntl();
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={containerRef}
      position="relative"
      marginTop={4}
      padding={4}
      background="neutral100"
      borderRadius="4px"
      borderColor={error ? "danger600" : "neutral200"}
      borderStyle="solid"
      borderWidth="1px"
    >
      {/* Selection Mode Toggle */}
      <Box marginBottom={3}>
        <Flex gap={3} alignItems="center">
          <Typography variant="pi" fontWeight="semiBold">
            {formatMessage({
              id: "image-hotspot.selection-mode",
              defaultMessage: "Selection Mode:",
            })}
          </Typography>
          <Flex gap={2}>
            <Button
              variant={selectionMode === "point" ? "default" : "tertiary"}
              size="S"
              onClick={() => onSelectionModeChange("point")}
            >
              {formatMessage({
                id: "image-hotspot.point-mode",
                defaultMessage: "Point",
              })}
            </Button>
            <Button
              variant={selectionMode === "rectangle" ? "default" : "tertiary"}
              size="S"
              onClick={() => onSelectionModeChange("rectangle")}
            >
              {formatMessage({
                id: "image-hotspot.rectangle-mode",
                defaultMessage: "Rectangle",
              })}
            </Button>
          </Flex>
        </Flex>
      </Box>

      <ImageContainer $position="relative">
        <HotspotImage
          ref={imageRef}
          src={imageUrl || ""}
          alt={imageData?.alternativeText || "Image with hotspots"}
          onMouseDown={onImageMouseDown}
          $cursor="crosshair"
          $zIndex={1}
        />
        {isDrawingRectangle && currentRectangle && (
          <DrawingRectangle
            $x={currentRectangle.x}
            $y={currentRectangle.y}
            $width={currentRectangle.width}
            $height={currentRectangle.height}
            $zIndex={5}
          />
        )}
        {hotspots.map((hotspot, index) =>
          hotspot.type === "point" ? (
            <HotspotMarker
              key={hotspot.id}
              hotspot={hotspot}
              number={index + 1}
              onDrag={onHotspotDrag}
              imageRef={imageRef}
            />
          ) : (
            <RectangleMarker
              key={hotspot.id}
              hotspot={hotspot}
              number={index + 1}
              onDrag={onHotspotDrag}
              onResize={onRectangleResize}
              imageRef={imageRef}
            />
          ),
        )}
      </ImageContainer>

      <Box marginTop={2}>
        <Typography variant="pi" textColor="neutral600">
          {selectionMode === "point"
            ? formatMessage({
                id: "image-hotspot.instruction-point",
                defaultMessage: "Click on the image to add a point",
              })
            : formatMessage({
                id: "image-hotspot.instruction-rectangle",
                defaultMessage:
                  "Click and drag on the image to draw a rectangle",
              })}
        </Typography>
      </Box>
    </Box>
  );
};
