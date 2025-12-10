import React from "react";
import { useIntl } from "react-intl";
import { Box, TextInput, Textarea, Field } from "@strapi/design-system";

interface CallbackActionFieldsProps {
  name: string;
  params: string;
  onNameChange: (name: string) => void;
  onParamsChange: (params: string) => void;
}

export const CallbackActionFields: React.FC<CallbackActionFieldsProps> = ({
  name,
  params,
  onNameChange,
  onParamsChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-callback-name",
              defaultMessage: "Function Name",
            })}
          </Field.Label>
          <TextInput
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onNameChange(e.target.value)
            }
            placeholder="handleHotspotClick"
          />
        </Field.Root>
      </Box>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-callback-params",
              defaultMessage: "Parameters (JSON)",
            })}
          </Field.Label>
          <Textarea
            value={params}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onParamsChange(e.target.value)
            }
            rows={4}
            placeholder='{"key": "value"}'
          />
        </Field.Root>
      </Box>
    </>
  );
};