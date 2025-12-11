import type { Core } from "@strapi/strapi";

const IMAGE_HOTSPOT_CUSTOM_FIELD = "plugin::image-hotspot.image-hotspot";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getContentTypeUid(ctx: any): string | null {
    if (ctx.state?.contentTypeUid) {
      return ctx.state.contentTypeUid;
    }

    const pathMatch = ctx.path?.match(/\/api\/([^\/]+)/);
    if (pathMatch) {
      const apiName = pathMatch[1];
      const singularName = apiName.replace(/s$/, "");
      return `api::${singularName}.${singularName}`;
    }

    return null;
  },

  getImageHotspotAttributes(contentType: any): Record<string, any> {
    if (!contentType?.attributes) {
      return {};
    }

    return Object.keys(contentType.attributes).reduce(
      (acc, key) => {
        const attribute = contentType.attributes[key];
        if (
          attribute?.type === "json" &&
          attribute?.customField === IMAGE_HOTSPOT_CUSTOM_FIELD
        ) {
          acc[key] = attribute;
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  },

  async populateImageField(
    entity: any,
    contentTypeUid: string,
    strapi: Core.Strapi,
  ): Promise<any> {
    if (!entity || typeof entity !== "object") {
      return entity;
    }

    const contentType = strapi.contentTypes[contentTypeUid];
    if (!contentType) {
      strapi.log.warn(
        `Content type ${contentTypeUid} not found, skipping image population`,
      );
      return entity;
    }

    const customFieldAttributes = this.getImageHotspotAttributes(contentType);

    if (Object.keys(customFieldAttributes).length === 0) {
      return entity;
    }

    await Promise.all(
      Object.keys(customFieldAttributes).map(async (key) => {
        const imageId = entity[key]?.image;
        if (imageId) {
          try {
            const media = await strapi
              .documents("plugin::upload.file")
              .findOne({ documentId: imageId });
            if (media) {
              entity[key].image = media;
            }
          } catch (error) {
            strapi.log.warn(
              `Failed to fetch media for ${contentTypeUid}.${key}:`,
              error,
            );
          }
        }
      }),
    );

    return entity;
  },
  async processResponseBody(body: any, contentTypeUid: string): Promise<any> {
    if (!body) {
      return body;
    }

    if (body.data !== undefined) {
      if (Array.isArray(body.data)) {
        body.data = await Promise.all(
          body.data.map((item: any) =>
            this.populateImageField(item, contentTypeUid, strapi),
          ),
        );
      } else {
        body.data = await this.populateImageField(
          body.data,
          contentTypeUid,
          strapi,
        );
      }
    } else if (Array.isArray(body)) {
      body = await Promise.all(
        body.map((item: any) =>
          this.populateImageField(item, contentTypeUid, strapi),
        ),
      );
    } else if (typeof body === "object") {
      body = await this.populateImageField(body, contentTypeUid, strapi);
    }

    return body;
  },
});
