import React from "react";
import { useIntl } from "react-intl";
import {
  Box,
  SingleSelect,
  SingleSelectOption,
  Field,
} from "@strapi/design-system";
import type { HotspotActionType } from "../types";

interface ActionTypeSelectorProps {
  value: HotspotActionType;
  onChange: (value: HotspotActionType) => void;
}

const actionTypeOptions = [
  {
    value: "none",
    id: "image-hotspot.action-none",
    defaultMessage: "No Action",
  },
  { value: "link", id: "image-hotspot.action-link", defaultMessage: "Link" },
  {
    value: "modal",
    id: "image-hotspot.action-modal",
    defaultMessage: "Modal",
  },
  {
    value: "tooltip",
    id: "image-hotspot.action-tooltip",
    defaultMessage: "Tooltip",
  },
  {
    value: "callback",
    id: "image-hotspot.action-callback",
    defaultMessage: "Callback",
  },
  {
    value: "relation",
    id: "image-hotspot.action-relation",
    defaultMessage: "Relation",
  },
] as const;

export const ActionTypeSelector: React.FC<ActionTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box marginBottom={3}>
      <Field.Root>
        <Field.Label>
          {formatMessage({
            id: "image-hotspot.action-type",
            defaultMessage: "Action Type",
          })}
        </Field.Label>
        <SingleSelect
          value={value}
          onChange={(val: string | number) =>
            onChange(String(val) as HotspotActionType)
          }
        >
          {actionTypeOptions.map((option) => (
            <SingleSelectOption key={option.value} value={option.value}>
              {formatMessage({
                id: option.id,
                defaultMessage: option.defaultMessage,
              })}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </Field.Root>
    </Box>
  );
};
