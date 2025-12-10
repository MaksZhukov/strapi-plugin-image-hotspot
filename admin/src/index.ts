export default {
  register(app: any) {
    // Register image-hotspot custom field
    app.customFields.register({
      name: "image-hotspot",
      pluginId: "image-hotspot",
      type: "json",
      intlLabel: {
        id: "image-hotspot.label",
        defaultMessage: "Image Hotspot",
      },
      intlDescription: {
        id: "image-hotspot.description",
        defaultMessage: "Add interactive hotspots to an image",
      },
      components: {
        Input: async () => import("./components"),
      } as any,
      options: {
        base: [],
      },
    });
  },
};
