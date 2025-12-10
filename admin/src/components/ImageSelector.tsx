import React from "react";
import { useIntl } from "react-intl";
import { Box, Button, Flex } from "@strapi/design-system";
import { Trash, Folder } from "@strapi/icons";

interface ImageSelectorProps {
  imageData: { id: number; url?: string; alternativeText?: string } | null;
  onSelectImage: () => void;
  onRemoveImage: () => void;
  isMediaLibraryOpen: boolean;
  MediaLibrary: any;
  onCloseMediaLibrary: () => void;
  onSelectAssets: (assets: any[]) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  imageData,
  onSelectImage,
  onRemoveImage,
  isMediaLibraryOpen,
  MediaLibrary,
  onCloseMediaLibrary,
  onSelectAssets,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box>
      <Flex gap={2} alignItems="flex-start">
        <Button
          variant="secondary"
          startIcon={<Folder />}
          onClick={onSelectImage}
        >
          {formatMessage({
            id: "image-hotspot.select-image",
            defaultMessage: "Select Image",
          })}
        </Button>
        {imageData && (
          <Button
            variant="tertiary"
            startIcon={<Trash />}
            onClick={onRemoveImage}
          >
            {formatMessage({
              id: "image-hotspot.remove-image",
              defaultMessage: "Remove Image",
            })}
          </Button>
        )}
      </Flex>
      {isMediaLibraryOpen && MediaLibrary && (
        <MediaLibrary
          allowedTypes={["images"]}
          onClose={onCloseMediaLibrary}
          onSelectAssets={onSelectAssets}
        />
      )}
    </Box>
  );
};
