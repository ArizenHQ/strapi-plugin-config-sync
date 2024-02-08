module.exports = ({ strapi }) => ({
  async getConfiguration() {
    const config = await strapi.plugins['config-sync'].config;
    return config;
  },

  async updateConfiguration(newConfig) {
    console.log("updateConfiguration ~ newConfig:", newConfig);
    try {
      //await strapi.plugin('my-plugin').config.set(key, value);

    } catch (error) {
        console.error("Error updating configuration:", error);
        throw new Error("Configuration update failed");
    }
  },
});
