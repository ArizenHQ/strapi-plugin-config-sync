const path = require('path');
const fs = require('fs').promises;

module.exports = {
  async getConfiguration() {
    const config = await strapi.plugins['config-sync'].config;
    return config;
  },

  async updateConfiguration(newConfig) {
    try {
        const configPath = path.join(strapi.dirs.extensions, 'config-sync', 'config', 'settings.json');
        const currentConfig = await this.getConfiguration();
        const updatedConfig = { ...currentConfig, ...newConfig };

        await fs.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf8');

        return updatedConfig;
    } catch (error) {
        console.error("Error updating configuration:", error);
        throw new Error("Configuration update failed");
    }
  },
};
