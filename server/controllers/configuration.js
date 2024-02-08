module.exports = {
  async getConfiguration(ctx) {
    try {
      const config = await strapi
        .plugin("config-sync")
        .service("configuration")
        .getConfiguration();
      ctx.send({ config });
    } catch (err) {
      console.error("getConfiguration ~ err:", err);
      ctx.send({ error: err.message }, 500);
    }
  },

  async updateConfiguration(ctx) {
    try {
      const newConfig = ctx.request.body;
      await strapi
        .plugin("config-sync")
        .service("configuration")
        .updateConfiguration(newConfig);
      ctx.send({ message: "Configuration updated successfully" });
    } catch (err) {
      console.error("updateConfiguration ~ err:", err);
      ctx.send({ error: err.message }, 500);
    }
  },
};

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
