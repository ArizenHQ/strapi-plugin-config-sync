const path = require('path');
const fs = require('fs').promises;

module.exports = {
  async getConfiguration() {
    const config = await strapi.plugins['config-sync'].config;
    return config;
  },

  async updateConfiguration(newConfig) {
    const configPath = path.join(strapi.dirs.extensions, 'config-sync', 'config', 'settings.json');
    const currentConfig = await this.getConfiguration();
    const updatedConfig = { ...currentConfig, ...newConfig };

    await fs.promises.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf8');

    return updatedConfig;
  },
};
