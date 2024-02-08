'use strict';

const { isEmpty } = require('lodash');
const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
const difference = require('../utils/getObjectDiff');
const { logMessage } = require('../utils');

/**
 * Main services for config import/export.
 */

module.exports = () => ({
  /**
   * Write a single config file.
   *
   * @param {string} configType - The type of the config.
   * @param {string} configName - The name of the config file.
   * @param {string} fileContents - The JSON content of the config file.
   * @returns {void}
   */
  writeConfigFile: async (configType, configName, fileContents) => {
    // Check if the config should be excluded.
    const shouldExclude = !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => `${configType}.${configName}`.startsWith(option)));
    if (shouldExclude) return;

    // Replace reserved characters in filenames.
    configName = configName.replace(/:/g, "#").replace(/\//g, "$");

    // Check if the JSON content should be minified.
    const json = !strapi.config.get('plugin.config-sync').minify
      ? JSON.stringify(fileContents, null, 2)
      : JSON.stringify(fileContents);

    if (!fs.existsSync(strapi.config.get('plugin.config-sync.syncDir'))) {
      fs.mkdirSync(strapi.config.get('plugin.config-sync.syncDir'), { recursive: true });
    }

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${strapi.config.get('plugin.config-sync.syncDir')}${configType}.${configName}.json`, json)
      .then(() => {
        // @TODO:
        // Add logging for successfull config export.
      })
      .catch(() => {
        // @TODO:
        // Add logging for failed config export.
      });
  },

  /**
   * Delete config file.
   *
   * @param {string} configName - The name of the config file.
   * @returns {void}
   */
   deleteConfigFile: async (configName) => {
    // Check if the config should be excluded.
    const shouldExclude = !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => configName.startsWith(option)));
    if (shouldExclude) return;

    // Replace reserved characters in filenames.
    configName = configName.replace(/:/g, "#").replace(/\//g, "$");

    fs.unlinkSync(`${strapi.config.get('plugin.config-sync.syncDir')}${configName}.json`);
  },

  /**
   * Read from a config file.
   *
   * @param {string} configType - The type of config.
   * @param {string} configName - The name of the config file.
   * @returns {object} The JSON content of the config file.
   */
  readConfigFile: async (configType, configName) => {
    // Replace reserved characters in filenames.
    configName = configName.replace(/:/g, "#").replace(/\//g, "$");

    const readFile = util.promisify(fs.readFile);
    return readFile(`${strapi.config.get('plugin.config-sync.syncDir')}${configType}.${configName}.json`)
      .then((data) => {
        return JSON.parse(data);
      })
      .catch(() => {
        return null;
      });
  },


  /**
   * Get all the config JSON from the filesystem.
   *
   * @param {string} configType - Type of config to gather. Leave empty to get all config.
   * @returns {object} Object with key value pairs of configs.
   */
  getAllConfigFromFiles: async (configType = null) => {
    if (!fs.existsSync(strapi.config.get('plugin.config-sync.syncDir'))) {
      return {};
    }

    const configFiles = fs.readdirSync(strapi.config.get('plugin.config-sync.syncDir'));

    const getConfigs = async () => {
      const fileConfigs = {};

      await Promise.all(configFiles.map(async (file) => {
        const type = file.split('.')[0]; // Grab the first part of the filename.
        const name = file.split(/\.(.+)/)[1].split('.').slice(0, -1).join('.'); // Grab the rest of the filename minus the file extension.

        // Put back reserved characters from filenames.
        const formattedName = name.replace(/#/g, ":").replace(/\$/g, "/");

        if (
          configType && configType !== type
          || !strapi.plugin('config-sync').types[type]
          || !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => `${type}.${name}`.startsWith(option)))
        ) {
          return;
        }

        const fileContents = await strapi.plugin('config-sync').service('main').readConfigFile(type, name);

        if (!fileContents) {
          strapi.log.warn(logMessage(`An empty config file '${file}' was found in the sync directory`));
          return;
        }

        fileConfigs[`${type}.${formattedName}`] = fileContents;
      }));

      return fileConfigs;
    };

    return getConfigs();
  },

  /**
   * Get all the config JSON from the database.
   *
   * @param {string} configType - Type of config to gather. Leave empty to get all config.
   * @returns {object} Object with key value pairs of configs.
   */
  getAllConfigFromDatabase: async (configType = null) => {
    const getConfigs = async () => {
      let databaseConfigs = {};

      await Promise.all(Object.entries(strapi.plugin('config-sync').types).map(async ([name, type]) => {
        if (configType && configType !== name) {
          return;
        }

        const config = await type.getAllFromDatabase();
        databaseConfigs = Object.assign(config, databaseConfigs);
      }));

      return databaseConfigs;
    };

    return getConfigs();
  },

  /**
   * Import all config files into the db.
   *
   * @param {string} configType - Type of config to impor. Leave empty to import all config.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   * @returns {void}
   */
  importAllConfig: async (configType = null, onSuccess) => {
    const fileConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromFiles();
    const databaseConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromDatabase();

    const diff = difference(databaseConfig, fileConfig);

    await Promise.all(Object.keys(diff).map(async (file) => {
      const type = file.split('.')[0]; // Grab the first part of the filename.
      const name = file.split(/\.(.+)/)[1]; // Grab the rest of the filename.

      if (configType && configType !== type) {
        return;
      }

      await strapi.plugin('config-sync').service('main').importSingleConfig(`${type}.${name}`, onSuccess);
    }));
  },

  /**
   * Export all config files.
   *
   * @param {string} configType - Type of config to export. Leave empty to export all config.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   * @returns {void}
   */
   exportAllConfig: async (configType = null, onSuccess) => {
    const fileConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromFiles();
    const databaseConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromDatabase();

    const diff = difference(databaseConfig, fileConfig);

    await Promise.all(Object.keys(diff).map(async (file) => {
      const type = file.split('.')[0]; // Grab the first part of the filename.
      const name = file.split(/\.(.+)/)[1]; // Grab the rest of the filename.

      if (configType && configType !== type) {
        return;
      }

      await strapi.plugin('config-sync').service('main').exportSingleConfig(`${type}.${name}`, onSuccess);
    }));
  },

  /**
   * Import a single config file into the db.
   *
   * @param {string} configName - The name of the config file.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   * @param {boolean} force - Ignore the soft setting.
   * @returns {void}
   */
  importSingleConfig: async (configName, onSuccess, force) => {
    // Check if the config should be excluded.
    const shouldExclude = !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => configName.startsWith(option)));
    if (shouldExclude) return;

    const type = configName.split('.')[0]; // Grab the first part of the filename.
    const name = configName.split(/\.(.+)/)[1]; // Grab the rest of the filename.
    const fileContents = await strapi.plugin('config-sync').service('main').readConfigFile(type, name);

    try {
      const importState = await strapi.plugin('config-sync').types[type].importSingle(name, fileContents, force);
      if (onSuccess && importState !== false) onSuccess(`${type}.${name}`);
    } catch (e) {
      throw new Error(`Error when trying to import ${type}.${name}. ${e}`);
    }
  },

  /**
   * Export a single config file.
   *
   * @param {string} configName - The name of the config file.
   * @param {object} onSuccess - Success callback to run on each single successfull import.
   *
   * @returns {void}
   */
   exportSingleConfig: async (configName, onSuccess) => {
     // Check if the config should be excluded.
    const shouldExclude = !isEmpty(strapi.config.get('plugin.config-sync.excludedConfig').filter((option) => configName.startsWith(option)));
    if (shouldExclude) return;

    const type = configName.split('.')[0]; // Grab the first part of the filename.
    const name = configName.split(/\.(.+)/)[1]; // Grab the rest of the filename.

    try {
      await strapi.plugin('config-sync').types[type].exportSingle(configName);
      if (onSuccess) onSuccess(`${type}.${name}`);
    } catch (e) {
      throw new Error(`Error when trying to export ${type}.${name}. ${e}`);
    }
  },

  /**
   * Get the formatted diff.
   *
   * @param {string} configType - Type of config to get the diff of. Leave empty to get the diff of all config.
   *
   * @returns {object} - the formatted diff.
   */
  getFormattedDiff: async (configType = null) => {
    const formattedDiff = {
      fileConfig: {},
      databaseConfig: {},
      diff: {},
    };

    const fileConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromFiles(configType);
    const databaseConfig = await strapi.plugin('config-sync').service('main').getAllConfigFromDatabase(configType);

    const diff = difference(databaseConfig, fileConfig);

    formattedDiff.diff = diff;

    Object.keys(diff).map((changedConfigName) => {
      formattedDiff.fileConfig[changedConfigName] = fileConfig[changedConfigName];
      formattedDiff.databaseConfig[changedConfigName] = databaseConfig[changedConfigName];
    });

    return formattedDiff;
  },

  /**
   * Deploy production config.
   * This function deploys the production configuration by executing Git commands to add, commit, and push changes to the repository.
   *
   * @param {string} user - The user initiating the deployment.
   * @returns {Promise<void>} A promise that resolves when the deployment process is complete.
   */
  deployProductionConfig: async (user) => {
    const syncDir = strapi.config.get('plugin.config-sync.syncDir');
    const commitMessage = 'Deploy production sync';

    // Assuming you have stored the user's email and name in Strapi's configuration
    const userEmail = user.email; // Replace with the actual configuration key
    const userName = `${user.firstname} ${user.lastname}`; // Replace with the actual configuration key

    // Make sure userEmail and userName are not empty
    if (!userEmail || !userName) {
      console.error('User information is not available.');
      throw new Error('Failed to create the PR. (User information is not available)');
    }

    console.log("createPR ~ process.env:", process.env);

    process.chdir(syncDir);
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'config-sync',
    });
    const config = await pluginStore.get({ key: 'settings' });

    const regex = /(?:https:\/\/github\.com\/|git@github\.com:)([^/]+)\/([^.]+)\.git/;
    const match = config.githubRepositoryConfigSync.match(regex);

    if (match) {
      const orga = match[1];
      const repo = match[2];
      const gitUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${orga}/${repo}.git`;

      const branchName = `deploy-config-${Date.now()}`; // Creates a unique branch name
      const commands = [
        `git config user.email "${userEmail}"`,
        `git config user.name "${userName}"`,
        `git -C "." checkout -b ${branchName}`, // Creates and switches to a new branch
        `git -C "." add .`,
        `git -C "." commit -m "${commitMessage}"`,
        `git remote set-url origin ${gitUrl}`,
        `git -C "." push -u origin ${branchName}`, // Pushes the branch to the remote repository
      ];

      // Execute the commands
      await commands.reduce(async (previousPromise, command) => {
        await previousPromise;
        return new Promise((resolve, reject) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return reject(error);
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve();
          });
        });
      }, Promise.resolve());

      // After pushing the branch, use the GitHub API to create a PR
      const createPR = async () => {
        const data = {
          title: 'Deployment of production configuration',
          head: branchName,
          base: 'master', // The branch you want to merge your branch into
          body: 'Please check the changes before merging.',
        };
        const { githubRepositoryConfigSync } = config;

        try {
          const response = await fetch(githubRepositoryConfigSync, {
            method: 'POST',
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`, // Assurez-vous d'avoir un jeton d'accès personnel GitHub et de le stocker en toute sécurité
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            // Capture et affiche des informations d'erreur plus détaillées
            const errorBody = await response.text(); // ou response.json() si l'API renvoie du JSON
            console.error(`Failed to create the PR. Status: ${response.status}, Body: ${errorBody}`);
            throw new Error(`Failed to create the PR. Status: ${response.status}, Body: ${errorBody}`);
          }

          const prData = await response.json();
          console.log(`PR created: ${prData.html_url}`);
          return `PR created: ${prData.html_url}`;
        } catch (error) {
          // Gestion des erreurs de réseau ou d'exécution de fetch
          console.error(`Error during PR creation: ${error.message}`);
          throw new Error(`Error during PR creation: ${error.message}`);
        }
      };

      const PR = await createPR();
      return PR;
    } else {
      console.error("L'URL du dépôt GitHub n'a pas pu être parsée.");
      throw new Error("Failed to parse GitHub repository URL.");
    }
  },
});

