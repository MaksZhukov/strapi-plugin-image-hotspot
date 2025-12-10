import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { Typography } from "@strapi/design-system";
import styled from "styled-components";
import type { Hotspot } from "../types";

interface HotspotMarkerProps {
  hotspot: Hotspot;
  number: number;
  onDrag: (id: string, x: number, y: number) => void;
  imageRef: React.RefObject<HTMLImageElement | null>;
}

interface MarkerContainerProps {
  $x: number;
  $y: number;
  $isDragging: boolean;
}

interface MarkerBadgeProps {
  $isDragging: boolean;
}

interface MarkerTextProps {
  $fontSize: string;
  $fontWeight: string;
  $lineHeight: number;
}

const MarkerContainer = styled.div<MarkerContainerProps>`
  position: absolute;
  left: ${(props) => props.$x}%;
  top: ${(props) => props.$y}%;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "grab")};
  z-index: 10;
  pointer-events: auto;
`;

const MarkerBadge = styled.div<MarkerBadgeProps>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary600};
  border: 3px solid white;
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: ${(props) => (props.$isDragging ? "none" : "all 0.2s ease")};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MarkerText = styled(Typography)<MarkerTextProps>`
  color: white;
  font-size: ${(props) => props.$fontSize};
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  user-select: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  hotspot,
  number,
  onDrag,
  imageRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  const onDragRef = useRef(onDrag);
  const hotspotRef = useRef(hotspot);

  // Keep refs up to date
  useEffect(() => {
    onDragRef.current = onDrag;
    hotspotRef.current = hotspot;
  }, [onDrag, hotspot]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging || !imageRef.current || !markerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      onDragRef.current(hotspotRef.current.id, x, y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, imageRef]);
  return (
    <MarkerContainer
      ref={markerRef}
      $x={hotspot.x}
      $y={hotspot.y}
      $isDragging={isDragging}
      onMouseDown={handleMouseDown}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
      }}
    >
      <MarkerBadge $isDragging={isDragging}>
        <MarkerText
          variant="pi"
          $fontSize="14px"
          $fontWeight="700"
          $lineHeight={1}
        >
          {number}
        </MarkerText>
      </MarkerBadge>
    </MarkerContainer>
  );
};
