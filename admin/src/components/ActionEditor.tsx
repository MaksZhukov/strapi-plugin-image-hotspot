import React from "react";
import { useIntl } from "react-intl";
import { Box, Button, Flex, Typography } from "@strapi/design-system";
import type { HotspotAction } from "../types";
import { useActionForm } from "../hooks";
import { ActionTypeSelector } from "./ActionTypeSelector";
import { LinkActionFields } from "./LinkActionFields";
import { ModalActionFields } from "./ModalActionFields";
import { TooltipActionFields } from "./TooltipActionFields";
import { CallbackActionFields } from "./CallbackActionFields";

interface ActionEditorProps {
  action: HotspotAction | undefined;
  onActionChange: (action: HotspotAction | undefined) => void;
  onClose: () => void;
}

export const ActionEditor: React.FC<ActionEditorProps> = ({
  action,
  onActionChange,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const { actionType, formState, updateActionType, updateField, buildAction } =
    useActionForm(action);

  const handleSave = () => {
    const newAction = buildAction();
    onActionChange(newAction);
    onClose();
  };

  const actionFieldsMap = {
    link: (
      <LinkActionFields
        url={formState.url}
        target={formState.target}
        onUrlChange={(url) => updateField("url", url)}
        onTargetChange={(target) => updateField("target", target)}
      />
    ),
    modal: (
      <ModalActionFields
        title={formState.modalTitle}
        content={formState.modalContent}
        onTitleChange={(title) => updateField("modalTitle", title)}
        onContentChange={(content) => updateField("modalContent", content)}
      />
    ),
    tooltip: (
      <TooltipActionFields
        text={formState.tooltipText}
        onChange={(text) => updateField("tooltipText", text)}
      />
    ),
    callback: (
      <CallbackActionFields
        name={formState.callbackName}
        params={formState.callbackParams}
        onNameChange={(name) => updateField("callbackName", name)}
        onParamsChange={(params) => updateField("callbackParams", params)}
      />
    ),
    none: null,
  };

  const renderActionFields = () => {
    return actionFieldsMap[actionType] ?? null;
  };

  return (
    <Box
      padding={4}
      background="neutral0"
      borderRadius="4px"
      borderColor="neutral200"
      borderStyle="solid"
      borderWidth="1px"
      marginTop={2}
    >
      <Typography variant="pi" fontWeight="semiBold" marginBottom={3}>
        {formatMessage({
          id: "image-hotspot.action-editor-title",
          defaultMessage: "Configure Action",
        })}
      </Typography>

      <ActionTypeSelector value={actionType} onChange={updateActionType} />

      {renderActionFields()}

      <Flex gap={2} justifyContent="flex-end">
        <Button variant="tertiary" onClick={onClose}>
          {formatMessage({
            id: "image-hotspot.cancel",
            defaultMessage: "Cancel",
          })}
        </Button>
        <Button onClick={handleSave}>
          {formatMessage({
            id: "image-hotspot.save",
            defaultMessage: "Save",
          })}
        </Button>
      </Flex>
    </Box>
  );
};
