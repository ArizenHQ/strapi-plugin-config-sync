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
        console.error("Erreur lors de la mise à jour de la configuration :", error);
        throw new Error("La mise à jour de la configuration a échoué");
    }
  },
};
