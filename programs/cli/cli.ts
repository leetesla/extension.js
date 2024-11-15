#!/usr/bin/env node

//  ██████╗██╗     ██╗
// ██╔════╝██║     ██║
// ██║     ██║     ██║
// ██║     ██║     ██║
// ╚██████╗███████╗██║
//  ╚═════╝╚══════╝╚═╝

import {program} from 'commander'
import {extensionCreate, type CreateOptions} from 'extension-create'
import {
  extensionDev,
  type DevOptions,
  extensionStart,
  type StartOptions,
  extensionBuild,
  type BuildOptions,
  extensionPreview,
  type FileConfig,
  type Manifest
} from 'extension-develop'
import * as messages from './cli-lib/messages'
import type {BrowsersSupported} from './types'
import checkUpdates from './check-updates'
import packageJson from './package.json'

export {type FileConfig, type Manifest}

// Before all, check for updates.
checkUpdates(packageJson)

const extensionJs = program

// ███████╗██╗  ██╗████████╗███████╗███╗   ██╗███████╗██╗ ██████╗ ███╗   ██╗        ██╗███████╗
// ██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝████╗  ██║██╔════╝██║██╔═══██╗████╗  ██║        ██║██╔════╝
// █████╗   ╚███╔╝    ██║   █████╗  ██╔██╗ ██║███████╗██║██║   ██║██╔██╗ ██║        ██║███████╗
// ██╔══╝   ██╔██╗    ██║   ██╔══╝  ██║╚██╗██║╚════██║██║██║   ██║██║╚██╗██║   ██   ██║╚════██║
// ███████╗██╔╝ ██╗   ██║   ███████╗██║ ╚████║███████║██║╚██████╔╝██║ ╚████║██╗╚█████╔╝███████║
// ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚════╝ ╚══════╝

extensionJs
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .addHelpText('after', messages.programHelp())

//  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
// ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
// ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

const vendors = (browser: BrowsersSupported) =>
  browser === 'all' ? 'chrome,edge,firefox'.split(',') : browser.split(',')

extensionJs
  .command('create')
  .arguments('<project-name|project-path>')
  .usage('create <project-name|project-path> [options]')
  .description('Creates a new extension.')
  .option(
    '-t, --template <template-name>',
    'specify a template for the created project'
  )
  .option(
    '--install',
    'whether or not to install the dependencies after creating the project'
  )
  .action(async function (
    pathOrRemoteUrl: string,
    {template, install}: CreateOptions
  ) {
    await extensionCreate(pathOrRemoteUrl, {
      template,
      install
    })
  })

// ██████╗ ███████╗██╗   ██╗
// ██╔══██╗██╔════╝██║   ██║
// ██║  ██║█████╗  ██║   ██║
// ██║  ██║██╔══╝  ╚██╗ ██╔╝
// ██████╔╝███████╗ ╚████╔╝
// ╚═════╝ ╚══════╝  ╚═══╝

extensionJs
  .command('dev')
  .arguments('[project-path|remote-url]')
  .usage('dev [project-path|remote-url] [options]')
  .description('Starts the development server (development mode)')
  .option(
    '-u, --user-data-dir <path-to-file | boolean>',
    '[DEPRECATED - Use "--profile" instead] what path to use for the browser profile. A boolean value of false sets the profile to the default user profile. Defaults to a fresh profile'
  )
  .option(
    '--profile <path-to-file | boolean>',
    'what path to use for the browser profile. A boolean value of false sets the profile to the default user profile. Defaults to a fresh profile'
  )
  .option(
    '-b, --browser <chrome | edge | firefox>',
    'specify a browser to run your extension in development mode'
  )
  .option(
    '--chromium-binary <path-to-binary>',
    'specify a path to the Chromium binary. This option overrides the --browser setting. Defaults to the system default'
  )
  .option(
    '--gecko-binary <path-to-binary>',
    'specify a path to the Gecko binary. This option overrides the --browser setting. Defaults to the system default'
  )
  .option(
    '--polyfill [boolean]',
    'whether or not to apply the cross-browser polyfill. Defaults to `true`'
  )
  .option(
    '-p, --port <number>',
    'what port should Extension.js WebSocket server run. Defaults to `8000`'
  )
  .option(
    '-o, --open [boolean]',
    'whether or not to open the browser automatically. Defaults to `true`'
  )
  .action(async function (
    pathOrRemoteUrl: string,
    {browser = 'chrome', ...devOptions}: DevOptions
  ) {
    for (const vendor of vendors(browser)) {
      await extensionDev(pathOrRemoteUrl, {
        browser: vendor as DevOptions['browser'],
        ...devOptions,
        // @ts-expect-error open is a boolean
        open: devOptions.open === 'false' ? false : true
      })
    }
  })

// ███████╗████████╗ █████╗ ██████╗ ████████╗
// ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝
// ███████╗   ██║   ███████║██████╔╝   ██║
// ╚════██║   ██║   ██╔══██║██╔══██╗   ██║
// ███████║   ██║   ██║  ██║██║  ██║   ██║
// ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝

extensionJs
  .command('start')
  .arguments('[project-path|remote-url]')
  .usage('start [project-path|remote-url] [options]')
  .description('Starts the development server (production mode)')
  .option(
    '-u, --user-data-dir <path-to-file | boolean>',
    '[DEPRECATED - Use "--profile" instead] what path to use for the browser profile. A boolean value of false sets the profile to the default user profile. Defaults to a fresh profile'
  )
  .option(
    '--profile <path-to-file | boolean>',
    'what path to use for the browser profile. A boolean value of false sets the profile to the default user profile. Defaults to a fresh profile'
  )
  .option(
    '-b, --browser <chrome | edge | firefox>',
    'specify a browser to run your extension in development mode'
  )
  .option(
    '--chromium-binary <path-to-binary>',
    'specify a path to the Chromium binary. This option overrides the --browser setting. Defaults to the system default'
  )
  .option(
    '--gecko-binary <path-to-binary>',
    'specify a path to the Gecko binary. This option overrides the --browser setting. Defaults to the system default'
  )
  .option(
    '--polyfill [boolean]',
    'whether or not to apply the cross-browser polyfill. Defaults to `true`'
  )
  .option(
    '-p, --port <number>',
    'what port should Extension.js run. Defaults to `3000`'
  )
  .action(async function (
    pathOrRemoteUrl: string,
    {browser = 'chrome', ...startOptions}: StartOptions
  ) {
    for (const vendor of vendors(browser)) {
      await extensionStart(pathOrRemoteUrl, {
        browser: vendor as StartOptions['browser'],
        ...startOptions
      })
    }
  })

// ██████╗ ██████╗ ███████╗██╗   ██╗██╗███████╗██╗    ██╗
// ██╔══██╗██╔══██╗██╔════╝██║   ██║██║██╔════╝██║    ██║
// ██████╔╝██████╔╝█████╗  ██║   ██║██║█████╗  ██║ █╗ ██║
// ██╔═══╝ ██╔══██╗██╔══╝  ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║
// ██║     ██║  ██║███████╗ ╚████╔╝ ██║███████╗╚███╔███╔╝
// ╚═╝     ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝

extensionJs
  .command('preview')
  .arguments('[project-name]')
  .usage('preview [path-to-remote-extension] [options]')
  .description('Builds the extension for production')
  .option(
    '--chromium-binary <path-to-binary>',
    'specify a path to the Chromium binary. This option overrides the --browser setting. Defaults to the system default'
  )
  .option(
    '--gecko-binary <path-to-binary>',
    'specify a path to the Gecko binary. This option overrides the --browser setting. Defaults to the system default'
  )
  .option(
    '-b, --browser <chrome | edge | firefox>',
    'specify a browser to preview your extension in production mode'
  )
  .action(async function (
    pathOrRemoteUrl: string,
    {browser = 'chrome', ...previewOptions}: BuildOptions
  ) {
    for (const vendor of vendors(browser)) {
      await extensionPreview(pathOrRemoteUrl, {
        mode: 'production',
        browser: vendor as any,
        ...previewOptions
      })
    }
  })

// ██████╗ ██╗   ██╗██╗██╗     ██████╗
// ██╔══██╗██║   ██║██║██║     ██╔══██╗
// ██████╔╝██║   ██║██║██║     ██║  ██║
// ██╔══██╗██║   ██║██║██║     ██║  ██║
// ██████╔╝╚██████╔╝██║███████╗██████╔╝
// ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝

extensionJs
  .command('build')
  .arguments('[project-name]')
  .usage('build [path-to-remote-extension] [options]')
  .description('Builds the extension for production')
  .option(
    '-b, --browser <chrome | edge | firefox>',
    'specify a browser to run your extension in development mode'
  )
  .option(
    '--polyfill [boolean]',
    'whether or not to apply the cross-browser polyfill. Defaults to `false`'
  )
  .option(
    '--zip [boolean]',
    'whether or not to compress the extension into a ZIP file. Defaults to `false`'
  )
  .option(
    '--zip-source [boolean]',
    'whether or not to include the source files in the ZIP file. Defaults to `false`'
  )
  .option(
    '--zip-filename <string>',
    'specify the name of the ZIP file. Defaults to the extension name and version'
  )
  .action(async function (
    pathOrRemoteUrl: string,
    {browser = 'chrome', ...buildOptions}: BuildOptions
  ) {
    for (const vendor of vendors(browser)) {
      await extensionBuild(pathOrRemoteUrl, {
        browser: vendor as BuildOptions['browser'],
        ...buildOptions
      })
    }
  })

extensionJs.parse()
