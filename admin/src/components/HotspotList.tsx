import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Box, Button, Flex, Typography } from "@strapi/design-system";
import { Trash, Cog } from "@strapi/icons";
import styled from "styled-components";
import type { Hotspot, HotspotAction } from "../types";
import { ActionEditor } from "./ActionEditor";

const formatActionLabel = (action: HotspotAction): string => {
  switch (action.type) {
    case "link":
      return action.url ? `Link (${action.url})` : "Link";
    case "modal":
      return `Modal (${action.modalTitle || "Untitled"})`;
    case "tooltip":
      return `Tooltip (${action.tooltipText || ""})`;
    case "callback":
      return `Callback (${action.callbackName || ""})`;
    default:
      return action.type;
  }
};

interface HotspotListProps {
  hotspots: Hotspot[];
  onDelete: (id: string) => void;
  onActionUpdate: (id: string, action: HotspotAction | undefined) => void;
}

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const StyledListItem = styled.li`
  padding: ${({ theme }) => theme.spaces[2]};
  background: ${({ theme }) => theme.colors.neutral0};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  margin-bottom: 8px;
`;

export const HotspotList: React.FC<HotspotListProps> = ({
  hotspots,
  onDelete,
  onActionUpdate,
}) => {
  const { formatMessage } = useIntl();
  const [editingActionId, setEditingActionId] = useState<string | null>(null);

  if (hotspots.length === 0) {
    return null;
  }

  return (
    <Box marginTop={4}>
      <Box marginBottom={2}>
        <Typography variant="pi" fontWeight="bold">
          {formatMessage({
            id: "image-hotspot.hotspots-list",
            defaultMessage: "Hotspots",
          })}{" "}
          ({hotspots.length})
        </Typography>
      </Box>
      <StyledList>
        {hotspots.map((hotspot, index) => (
          <StyledListItem key={hotspot.id}>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="pi">
                  {index + 1} - {hotspot.type}{" "}
                  {hotspot.type === "point" ? (
                    <>
                      X: {hotspot.x.toFixed(1)}%, Y: {hotspot.y.toFixed(1)}%
                    </>
                  ) : (
                    <>
                      X: {hotspot.x.toFixed(1)}%, Y: {hotspot.y.toFixed(1)}%, W:{" "}
                      {hotspot.width?.toFixed(1)}%, H:{" "}
                      {hotspot.height?.toFixed(1)}%
                    </>
                  )}
                </Typography>
                {hotspot.action && hotspot.action.type !== "none" && (
                  <Typography variant="pi" textColor="neutral600" fontSize={1}>
                    {formatMessage({
                      id: "image-hotspot.action-label",
                      defaultMessage: "Action:",
                    })}{" "}
                    {formatActionLabel(hotspot.action)}
                  </Typography>
                )}
              </Box>
              <Flex gap={2}>
                <Button
                  variant="tertiary"
                  size="S"
                  onClick={() =>
                    setEditingActionId(
                      editingActionId === hotspot.id ? null : hotspot.id,
                    )
                  }
                  startIcon={<Cog />}
                >
                  {formatMessage({
                    id: "image-hotspot.configure-action",
                    defaultMessage: "Action",
                  })}
                </Button>
                <Button
                  variant="tertiary"
                  size="S"
                  onClick={() => onDelete(hotspot.id)}
                  startIcon={<Trash />}
                >
                  {formatMessage({
                    id: "image-hotspot.delete",
                    defaultMessage: "Delete",
                  })}
                </Button>
              </Flex>
            </Flex>
            {editingActionId === hotspot.id && (
              <ActionEditor
                action={hotspot.action}
                onActionChange={(action) => {
                  onActionUpdate(hotspot.id, action);
                  setEditingActionId(null);
                }}
                onClose={() => setEditingActionId(null)}
              />
            )}
          </StyledListItem>
        ))}
      </StyledList>
    </Box>
  );
};
