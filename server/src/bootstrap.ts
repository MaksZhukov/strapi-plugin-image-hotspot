import type { Core } from "@strapi/strapi";

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.server.use(async (ctx, next) => {
    if (!ctx.path?.startsWith("/api")) {
      return next();
    }

    await next();

    try {
      const imageHotspotService = strapi
        .plugin("image-hotspot")
        .service("image-hotspot");

      const contentTypeUid = imageHotspotService.getContentTypeUid(ctx);

      if (!contentTypeUid) {
        return;
      }

      ctx.body = await imageHotspotService.processResponseBody(
        ctx.body,
        contentTypeUid,
      );
    } catch (error) {
      strapi.log.error(
        `Error populating image field for ${ctx.state?.contentTypeUid || "unknown"}:`,
        error,
      );
    }
  });
};

export default bootstrap;
