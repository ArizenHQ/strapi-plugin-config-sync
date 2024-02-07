module.exports = {
  async getConfiguration(ctx) {
    try {
      const config = await strapi.plugin('config-sync').service('configuration').getConfiguration();
      ctx.send({ config });
    } catch (err) {
      ctx.send({ error: err.message }, 500);
    }
  },

  async updateConfiguration(ctx) {
    try {
      const newConfig = ctx.request.body;
      await strapi.plugin('config-sync').service('configuration').updateConfiguration(newConfig);
      ctx.send({ message: 'Configuration updated successfully' });
    } catch (err) {
      ctx.send({ error: err.message }, 500);
    }
  },
};
