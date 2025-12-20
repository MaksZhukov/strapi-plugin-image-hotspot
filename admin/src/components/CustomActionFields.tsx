import React from "react";
import { useIntl } from "react-intl";
import { Box, TextInput, Textarea, Field } from "@strapi/design-system";

interface CustomActionFieldsProps {
  name: string;
  payload: string;
  onNameChange: (name: string) => void;
  onPayloadChange: (payload: string) => void;
}

export const CustomActionFields: React.FC<CustomActionFieldsProps> = ({
  name,
  payload,
  onNameChange,
  onPayloadChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-custom-name",
              defaultMessage: "Name",
            })}
          </Field.Label>
          <TextInput
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onNameChange(e.target.value)
            }
            placeholder="Custom Name"
          />
        </Field.Root>
      </Box>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-custom-payload",
              defaultMessage: "Payload (JSON)",
            })}
          </Field.Label>
          <Textarea
            value={payload}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onPayloadChange(e.target.value)
            }
            rows={6}
            placeholder='{"key": "value"}'
          />
        </Field.Root>
      </Box>
    </>
  );
};
