# Image Hotspot Plugin

A Strapi v5 plugin that provides a custom field for adding interactive hotspots (points and rectangles) to images with various action types.

## Preview

![Preview](./preview.png)

## Features

- **Image Selection**: Select images from the media library via modal dialog
- **Point Hotspots**: Add point hotspots by clicking on the image
- **Rectangle Hotspots**: Add rectangle hotspots by clicking and dragging
- **Hotspot Management**: Drag, resize, and delete hotspots
- **Visual Feedback**: Visual indicators for selected hotspots
- **Multiple Action Types**: Configure actions for each hotspot:
  - **Link**: Navigate to a URL (with target options)
  - **Modal**: Display content in a modal dialog
  - **Tooltip**: Show tooltip text on hover
  - **Callback**: Execute custom JavaScript functions
  - **None**: No action
- **Automatic Image Population**: Server-side middleware automatically populates image fields in API responses, so you get full image objects instead of just IDs

## Installation

This plugin is automatically loaded by Strapi when placed in the `src/plugins` directory.

### Server-Side Features

The plugin includes server-side middleware that automatically:

- Intercepts API responses for content types using the image-hotspot field
- Populates image references with full media objects (including URL, alternative text, etc.)
- Works with both single entity and collection responses

This means when you fetch data via the API, the `image` field in your hotspot data will already contain the full media object, not just an ID.

## Usage

### Adding to Content Type Schema

In your content type schema, use:

```json
{
  "attributes": {
    "imageHotspot": {
      "type": "customField",
      "customField": "plugin::image-hotspot::image-hotspot"
    }
  }
}
```

### Action Types

#### Link Action

Navigate to a URL when the hotspot is clicked:

- `url`: The target URL
- `target`: `"_self"` (same tab) or `"_blank"` (new tab)

#### Modal Action

Display content in a modal dialog:

- `modalTitle`: Title of the modal
- `modalContent`: Content to display in the modal

#### Tooltip Action

Show tooltip text on hover:

- `tooltipText`: Text to display in the tooltip

#### Callback Action

Execute a custom JavaScript function when the hotspot is clicked:

- `callbackName`: Name of the function to call (e.g., `"handleHotspotClick"`)
- `callbackParams`: JSON object with parameters to pass to the function

**Example:**

```json
{
  "type": "callback",
  "callbackName": "handleHotspotClick",
  "callbackParams": {
    "hotspotId": "123",
    "action": "navigate"
  }
}
```

On the frontend, you would implement the callback function:

```javascript
window.handleHotspotClick = function (params) {
  console.log("Hotspot clicked with params:", params);
  // Your custom logic here
};
```

### Using in Frontend

When rendering the image with hotspots on your frontend, you'll need to:

1. Parse the JSON data from the custom field
2. Render the image (the image object is automatically populated by the server)
3. Position hotspots based on their coordinates
4. Handle click events based on the action type

**Note**: The server automatically populates the `image` field with the full media object, so you can directly access `data.image.url` without needing to fetch the media separately.

**Example React component:**

```tsx
import { ImageHotspotValue } from "./types";

function HotspotImage({ data }: { data: ImageHotspotValue }) {
  const handleHotspotClick = (hotspot: Hotspot) => {
    if (!hotspot.action) return;

    switch (hotspot.action.type) {
      case "link":
        if (hotspot.action.url) {
          window.open(hotspot.action.url, hotspot.action.target || "_self");
        }
        break;
      case "modal":
        // Show modal with hotspot.action.modalTitle and hotspot.action.modalContent
        break;
      case "tooltip":
        // Show tooltip with hotspot.action.tooltipText
        break;
      case "callback":
        if (
          hotspot.action.callbackName &&
          window[hotspot.action.callbackName]
        ) {
          window[hotspot.action.callbackName](hotspot.action.callbackParams);
        }
        break;
    }
  };

  return (
    <div className="hotspot-container">
      <img src={data.image?.url} alt={data.image?.alternativeText} />
      {data.hotspots?.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`hotspot hotspot-${hotspot.type}`}
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: hotspot.width ? `${hotspot.width}%` : undefined,
            height: hotspot.height ? `${hotspot.height}%` : undefined,
          }}
          onClick={() => handleHotspotClick(hotspot)}
        >
          {hotspot.label}
        </div>
      ))}
    </div>
  );
}
```

## License

MIT
