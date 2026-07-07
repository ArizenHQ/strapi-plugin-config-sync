<div align="center">
<h1>Strapi config-sync plugin</h1>
	
<p style="margin-top: 0;">This plugin is a multi-purpose tool to manage your Strapi database records through JSON files. Mostly used to version controlconfig data for automated deployment, automated tests and data sharing for collaboration purposes.</p>

<a href="https://docs.pluginpal.io/config-sync">Read the documentation</a>
	
<p>
  <a href="https://www.npmjs.org/package/strapi-plugin-config-sync">
    <img src="https://img.shields.io/npm/v/strapi-plugin-config-sync/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-config-sync">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-config-sync" alt="Monthly download on NPM" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync">
    <img src="https://img.shields.io/github/actions/workflow/status/boazpoolman/strapi-plugin-config-sync/tests.yml?branch=master" alt="CI build status" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync">
    <img src="https://codecov.io/gh/boazpoolman/strapi-plugin-config-sync/coverage.svg?branch=master" alt="codecov.io" />
  </a>
</p>
</div>

## ✨ Features

- **CLI** - `config-sync` CLI for syncing the config from the command line
- **GUI** - Settings page for syncing the config in Strapi admin
- **Partial sync** - Import or export only specific portions of config
- **Custom types** - Include your custom collection types in the sync process
- **Import on bootstrap** - Easy automated deployment with `importOnBootstrap`
- **Exclusion** - Exclude single config entries or all entries of a given type
- **Diff viewer** - A git-style diff viewer to inspect the config changes

## ⏳ Getting started

[Read the Getting Started tutorial](https://docs.pluginpal.io/config-sync) or follow the steps below:

```bash
# using yarn
yarn add strapi-plugin-config-sync

# using npm
npm install strapi-plugin-config-sync --save
```
 
Add the export path to the `watchIgnoreFiles` list in the `config/admin.js` file.
This way your app won't reload when you export the config in development.

##### `config/admin.js`:
```
module.exports = ({ env }) => ({
  // ...
  watchIgnoreFiles: [
    '**/config/sync/**',
  ],
});
```

After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

```bash
# using yarn
yarn build
yarn develop

# using npm
npm run build
npm run develop
```

The **Config Sync** plugin should now appear in the **Settings** section of your Strapi app.

To start tracking your config changes you have to make the first export. This will dump all your configuration data to the `/config/sync` directory. You can export either through [the CLI](https://docs.pluginpal.io/config-sync/cli) or [Strapi admin panel](https://docs.pluginpal.io/config-sync/admin-gui)

Enjoy 🎉

## Testing with yalc

Use [yalc](https://github.com/wclr/yalc) to test a feature branch of this plugin in a Strapi app before publishing. The Strapi app runs in Docker; commands below are run from the **Strapi app root** unless noted.

### One-time setup

In the **plugin** repo (on your host):

```sh
# Install plugin dependencies
yarn install
# Build the plugin and publish it to the local yalc store
yarn build
npx yalc push --publish
```

In the **Strapi** app (on a feature branch):

```sh
# Link the local plugin package (updates package.json and .yalc/ on the host)
npx yalc add @arizenhq/strapi-plugin-config-sync
```

Enable the plugin in `config/plugins.js`, then install it in the container and start Strapi:

```sh
# Install the plugin into the container node_modules (separate Docker volume)
docker-compose exec dev yarn add file:.yalc/@arizenhq/strapi-plugin-config-sync
# Rebuild the Strapi admin panel
make update/code
# Start Strapi in development mode
make dev
```

Do not commit `.yalc/`, `yalc.lock`, or the `file:.yalc/...` dependency — replace with a published version before merging.

### After each plugin change

Repeat when you change the plugin and want to test again.

In the **plugin** repo (on your host):

```sh
# Rebuild the plugin
yarn build
# Push the built package to linked Strapi apps
npx yalc push --publish
```

In the **Strapi** app:

```sh
# Reinstall the plugin from the local yalc store into the container
docker-compose exec dev yarn add file:.yalc/@arizenhq/strapi-plugin-config-sync
# Clear the Vite cache so develop picks up the new plugin build
docker-compose exec dev rm -rf node_modules/.strapi/vite
# Rebuild the Strapi admin panel
make update/code
# Restart Strapi in development mode
make dev
```

## Publishing a new version

This package is published to [GitHub Packages](https://github.com/orgs/ArizenHQ/packages) under the `@arizenhq` scope. Publishing is automated by the `publish.yml` workflow when a GitHub Release is created.

### How to release

1. Merge your changes into the `master` branch.
2. On GitHub, go to **Releases → New release**.
3. Create a new tag that matches the version you want to publish (for example `4.0.1`). Use the same format as previous releases (e.g. `3.1.28`, without a `v` prefix).
4. Publish the release. This triggers the publish workflow automatically.

You do not need to manually bump `package.json` before creating the release. The version in `package.json` on `master` before the release is overwritten by CI during publishing.

### What the publish workflow does

When the release is published, GitHub Actions runs the following steps:

1. **Install dependencies** from `yarn.lock`.
2. **Build the plugin** (`yarn build`) to produce the `dist/` folder required for Strapi v5.
3. **Read the version** from the release tag you created (e.g. tag `4.0.1` becomes version `4.0.1`).
4. **Update `package.json`** on the CI runner to that version (this does not create a new git tag).
5. **Publish** `@arizenhq/strapi-plugin-config-sync` to GitHub Packages at that version.
6. **Commit the version bump** back to the `master` branch with a message like `chore: Bump version to 4.0.1`. This keeps `package.json` on `master` in sync with what was published.

### Installing a published version

In a Strapi app, add the dependency and configure the GitHub Packages registry (see ArizenHQ internal docs), then:

```sh
# Install a specific published version
yarn add @arizenhq/strapi-plugin-config-sync@4.0.1
```

## 📓 Documentation

See our dedicated [repository](https://github.com/pluginpal/docs) for all of PluginPal's documentation, or view the Config Sync documentation live:

- [Config Sync documentation](https://docs.pluginpal.io/config-sync)

## 🤝 Contributing

Feel free to fork and make a pull request of this plugin. All the input is welcome!

## ⭐️ Show your support

Give a star if this project helped you.

## 🔗 Links

- [PluginPal marketplace](https://www.pluginpal.io/plugin/config-sync)
- [NPM package](https://www.npmjs.com/package/strapi-plugin-config-sync)
- [GitHub repository](https://github.com/boazpoolman/strapi-plugin-config-sync)
- [Strapi marketplace](https://market.strapi.io/plugins/strapi-plugin-config-sync)

## 🌎 Community support

- For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/).
- For support with this plugin you can DM me in the Strapi Discord [channel](https://discord.strapi.io/).

## 📝 Resources

- [MIT License](https://github.com/pluginpal/strapi-plugin-config-sync/blob/master/LICENSE.md)
