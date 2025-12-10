import React from "react";
import { useIntl } from "react-intl";
import { Box, TextInput, Field } from "@strapi/design-system";

interface TooltipActionFieldsProps {
  text: string;
  onChange: (text: string) => void;
}

export const TooltipActionFields: React.FC<TooltipActionFieldsProps> = ({
  text,
  onChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box marginBottom={3}>
      <Field.Root>
        <Field.Label>
          {formatMessage({
            id: "image-hotspot.action-tooltip-text",
            defaultMessage: "Tooltip Text",
          })}
        </Field.Label>
        <TextInput
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
        />
      </Field.Root>
    </Box>
  );
};
