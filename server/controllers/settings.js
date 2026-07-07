'use strict';

export default {
  async getSettings(ctx) {
    try {
      const config = await strapi.plugin('config-sync').service('settings').getSettings();
      ctx.send({ config });
    } catch (err) {
      ctx.throw(500, err.message);
    }
  },

  async setSettings(ctx) {
    try {
      await strapi.plugin('config-sync').service('settings').setSettings(ctx.request.body);
      ctx.send({ message: 'Configuration updated successfully' });
    } catch (err) {
      ctx.throw(500, err.message);
    }
  },
};
