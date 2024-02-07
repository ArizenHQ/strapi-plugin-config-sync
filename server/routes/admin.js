'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: "POST",
      path: "/export",
      handler: "config.exportAll",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/import",
      handler: "config.importAll",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/diff",
      handler: "config.getDiff",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/app-env",
      handler: "config.getAppEnv",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/deploy-production",
      handler: "config.deployProduction",
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/configuration',
      handler: 'configuration.getConfiguration',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/configuration',
      handler: 'configuration.updateConfiguration',
      config: {
        policies: [],
      },
    },
  ],
};
