import {WebpackError, type Compilation} from 'webpack'
import {type ErrorObject} from 'ajv'
import * as messages from '../../lib/messages'

export default function handleDeprecatedError(
  compilation: Compilation,
  errorData: ErrorObject<string, Record<string, any>, unknown> | undefined,
  browser: string
) {
  compilation.warnings.push(
    new WebpackError(messages.deprecatedMessage(browser, errorData))
  )
}
