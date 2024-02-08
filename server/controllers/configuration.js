module.exports = {
  async getSettings(ctx) {
    try {
      const config = await strapi
        .plugin("config-sync")
        .service("configuration")
        .getSettings();
      ctx.send({ config });
    } catch (err) {
      console.error("getConfiguration ~ err:", err);
      ctx.send({ error: err.message }, 500);
    }
  },

  async setSettings(ctx) {
    try {
      const newConfig = ctx.request.body;
      await strapi
        .plugin("config-sync")
        .service("configuration")
        .setSettings(newConfig);
      ctx.send({ message: "Configuration updated successfully" });
    } catch (err) {
      console.error("updateConfiguration ~ err:", err);
      ctx.send({ error: err.message }, 500);
    }
  },
};

