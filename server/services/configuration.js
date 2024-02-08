module.exports = {
  async getConfiguration() {
    const config = await strapi.plugins['config-sync'].config;
    return config;
  },

  async updateConfiguration(config) {
    try {
      await Promise.all(
        Object.entries(config).map(([key, value]) => strapi.plugin('config-sync').config.set(key, value))
      );
      return config;
    } catch (error) {
        console.error("Error updating configuration:", error);
        throw new Error("Configuration update failed");
    }
  },
};
