import React from "react";
import { useIntl } from "react-intl";
import {
  Box,
  TextInput,
  SingleSelect,
  SingleSelectOption,
  Field,
} from "@strapi/design-system";

interface LinkActionFieldsProps {
  url: string;
  target: "_self" | "_blank";
  onUrlChange: (url: string) => void;
  onTargetChange: (target: "_self" | "_blank") => void;
}

export const LinkActionFields: React.FC<LinkActionFieldsProps> = ({
  url,
  target,
  onUrlChange,
  onTargetChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-link-url",
              defaultMessage: "URL",
            })}
          </Field.Label>
          <TextInput
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onUrlChange(e.target.value)
            }
            placeholder="https://example.com"
          />
        </Field.Root>
      </Box>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-link-target",
              defaultMessage: "Target",
            })}
          </Field.Label>
          <SingleSelect
            value={target}
            onChange={(val: string | number) =>
              onTargetChange(String(val) as "_self" | "_blank")
            }
          >
            <SingleSelectOption value="_self">
              {formatMessage({
                id: "image-hotspot.action-link-target-self",
                defaultMessage: "Same Window",
              })}
            </SingleSelectOption>
            <SingleSelectOption value="_blank">
              {formatMessage({
                id: "image-hotspot.action-link-target-blank",
                defaultMessage: "New Window",
              })}
            </SingleSelectOption>
          </SingleSelect>
        </Field.Root>
      </Box>
    </>
  );
};