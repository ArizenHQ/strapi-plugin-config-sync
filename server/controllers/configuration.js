const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("plugin::config-sync.configuration", {
  async count(ctx) {
    ctx.body = await strapi
      .plugin("config-sync")
      .service("configuration")
      .count();
  },
  async getSettings(ctx) {
    try {
      ctx.body = await strapi
        .plugin("config-sync")
        .service("configuration")
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async setSettings(ctx) {
    const { body } = ctx.request;
    try {
      await strapi
        .plugin("config-sync")
        .service("configuration")
        .setSettings(body);
      ctx.body = await strapi
        .plugin("config-sync")
        .service("configuration")
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
