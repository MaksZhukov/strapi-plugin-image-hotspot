import React from "react";
import { useIntl } from "react-intl";
import { Box, TextInput, Textarea, Field } from "@strapi/design-system";

interface ModalActionFieldsProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

export const ModalActionFields: React.FC<ModalActionFieldsProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-modal-title",
              defaultMessage: "Modal Title",
            })}
          </Field.Label>
          <TextInput
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onTitleChange(e.target.value)
            }
          />
        </Field.Root>
      </Box>
      <Box marginBottom={3}>
        <Field.Root>
          <Field.Label>
            {formatMessage({
              id: "image-hotspot.action-modal-content",
              defaultMessage: "Modal Content",
            })}
          </Field.Label>
          <Textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onContentChange(e.target.value)
            }
            rows={4}
          />
        </Field.Root>
      </Box>
    </>
  );
};