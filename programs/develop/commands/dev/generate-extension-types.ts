// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import path from 'path'
import fs from 'fs/promises'
import * as messages from '../../webpack/lib/messages'

export default async function generateExtensionTypes(projectDir: string) {
  const extensionEnvFile = path.join(projectDir, 'extension-env.d.ts')

  const typePath =
    process.env.EXTENSION_ENV === 'development'
      ? '../../programs/develop/types'
      : `@extension-create/develop/dist/types`

  const fileContent = `\
// Required Extension.js types for TypeScript projects.
// This file is auto-generated and should not be excluded.
// If you need extra types, consider creating a new *.d.ts and
// referencing it in the "include" array of your tsconfig.json file.
// See https://www.typescriptlang.org/tsconfig#include for info.
/// <reference types="${typePath}/index.d.ts" />

// Polyfill types for browser.* APIs.
/// <reference types="${typePath}/polyfill.d.ts" />
`

  try {
    // Check if the file exists
    await fs.access(extensionEnvFile)
  } catch (err) {
    // File does not exist, continue to write it
    const manifest = require(path.join(projectDir, 'manifest.json'))
    console.log(messages.writingTypeDefinitions(manifest))
    try {
      await fs.writeFile(extensionEnvFile, fileContent)
    } catch (writeErr) {
      console.log(
        '🔴 - Failed to write the extension type definition.',
        writeErr
      )
    }
  }
}
