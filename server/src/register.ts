import type { Core } from "@strapi/strapi";

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // Register image-hotspot custom field on the server side

  strapi.customFields.register({
    name: "image-hotspot",
    plugin: "image-hotspot",
    type: "json",
    inputSize: {
      default: 12,
      isResizable: true,
    },
  });
};

export default register;
