'use strict';

function getPluginStore() {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'config-sync',
  });
}

async function createDefaultConfig() {
  const pluginStore = getPluginStore();
  const value = {
    disabled: false,
    githubRepositoryConfigSync: strapi.config.get('plugin::config-sync.githubRepositoryConfigSync'),
  };
  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
}

export default {
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  },

  async setSettings(settings) {
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: 'settings', value: settings });
    return pluginStore.get({ key: 'settings' });
  },
};
