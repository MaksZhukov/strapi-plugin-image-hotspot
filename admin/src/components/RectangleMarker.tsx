import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { Typography } from "@strapi/design-system";
import styled from "styled-components";
import type { Hotspot } from "../types";

interface RectangleMarkerProps {
  hotspot: Hotspot;
  number: number;
  onDrag: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  imageRef: React.RefObject<HTMLImageElement | null>;
}

interface MarkerContainerProps {
  $x: number;
  $y: number;
  $width: number;
  $height: number;
  $isDragging: boolean;
}

interface NumberLabelProps {
  $zIndex: number;
}

interface ResizeHandleProps {
  $zIndex: number;
}

interface NumberTextProps {
  $fontSize: string;
  $fontWeight: string;
  $lineHeight: number;
}

const MarkerContainer = styled.div<MarkerContainerProps>`
  position: absolute;
  left: ${(props) => props.$x}%;
  top: ${(props) => props.$y}%;
  width: ${(props) => props.$width}%;
  height: ${(props) => props.$height}%;
  border: 2px solid ${({ theme }) => theme.colors.primary600};
  background: rgba(0, 123, 255, 0.1);
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "grab")};
  z-index: 10;
  box-sizing: border-box;
`;

const NumberLabel = styled.div<NumberLabelProps>`
  position: absolute;
  top: -16px;
  left: -16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  z-index: ${(props) => props.$zIndex};
  pointer-events: none;
  background: ${({ theme }) => theme.colors.primary600};
`;

const NumberText = styled(Typography)<NumberTextProps>`
  color: white;
  font-size: ${(props) => props.$fontSize};
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  user-select: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ResizeHandle = styled.div<ResizeHandleProps>`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 12px;
  height: 12px;
  background: ${({ theme }) => theme.colors.primary600};
  border: 2px solid white;
  border-radius: 2px;
  cursor: nwse-resize;
  z-index: ${(props) => props.$zIndex};
`;

export const RectangleMarker: React.FC<RectangleMarkerProps> = ({
  hotspot,
  number,
  onDrag,
  onResize,
  imageRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [dragStart, setDragStart] = useState<{
    mouseX: number;
    mouseY: number;
    rectX: number;
    rectY: number;
  } | null>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const onDragRef = useRef(onDrag);
  const onResizeRef = useRef(onResize);
  const hotspotRef = useRef(hotspot);

  // Keep refs up to date
  useEffect(() => {
    onDragRef.current = onDrag;
    onResizeRef.current = onResize;
    hotspotRef.current = hotspot;
  }, [onDrag, onResize, hotspot]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.classList.contains("resize-handle")) {
        setIsResizing(true);
        setResizeStart({
          x: hotspotRef.current.x,
          y: hotspotRef.current.y,
          width: hotspotRef.current.width || 0,
          height: hotspotRef.current.height || 0,
        });
      } else {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

        setIsDragging(true);
        setDragStart({
          mouseX,
          mouseY,
          rectX: hotspotRef.current.x,
          rectY: hotspotRef.current.y,
        });
      }
    },
    [imageRef],
  );

  useEffect(() => {
    if ((!isDragging && !isResizing) || !imageRef.current || !markerRef.current)
      return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const currentX = ((e.clientX - rect.left) / rect.width) * 100;
      const currentY = ((e.clientY - rect.top) / rect.height) * 100;

      if (isDragging && dragStart) {
        const offsetX = currentX - dragStart.mouseX;
        const offsetY = currentY - dragStart.mouseY;
        const newX = dragStart.rectX + offsetX;
        const newY = dragStart.rectY + offsetY;

        onDragRef.current(hotspotRef.current.id, newX, newY);
      } else if (isResizing && resizeStart) {
        const newWidth = Math.max(1, currentX - hotspotRef.current.x);
        const newHeight = Math.max(1, currentY - hotspotRef.current.y);
        onResizeRef.current(hotspotRef.current.id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeStart(null);
      setDragStart(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, resizeStart, dragStart]);

  return (
    <MarkerContainer
      ref={markerRef}
      $x={hotspot.x}
      $y={hotspot.y}
      $width={hotspot.width || 0}
      $height={hotspot.height || 0}
      $isDragging={isDragging}
      onMouseDown={handleMouseDown}
    >
      <NumberLabel $zIndex={12}>
        <NumberText
          variant="pi"
          $fontSize="14px"
          $fontWeight="700"
          $lineHeight={1}
        >
          {number}
        </NumberText>
      </NumberLabel>
      <ResizeHandle className="resize-handle" $zIndex={11} />
    </MarkerContainer>
  );
};
