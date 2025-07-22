import APP_CONSTANTS from '../constants'
import fs from 'fs-extra'
import colors from 'picocolors'
import { wrapEnvConfig, wrapRootPath, wrapConfigName } from '../wrapViteEnvs'
import pkg from '../../package.json'
import type { AppConfigOptions } from 'app-config-plugin'

function createConfig(params: AppConfigOptions = {} as AppConfigOptions) {
  const { configName, configContext, configFileName } = params
  try {
    const windowConfig = `window.${configName}`
    // Ensure that the variable will not be modified
    let configContent = `${windowConfig}=${JSON.stringify(configContext)};`
    configContent += `
      Object.freeze(${windowConfig});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '')

    fs.mkdirp(wrapRootPath(APP_CONSTANTS.APP_OUTPUT_NAME))
    fs.outputFileSync(
      wrapRootPath(`${APP_CONSTANTS.APP_OUTPUT_NAME}/${configFileName}`),
      configContent,
    )

    console.log(colors.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`)
    console.log(
      colors.gray(APP_CONSTANTS.APP_OUTPUT_NAME + '/' + colors.green(configFileName)) + '\n',
    )
    return true
  } catch (error) {
    console.log(colors.red('configuration file configuration file failed to package:\n' + error))
    return false
  }
}

export default function createAppConfig() {
  const configContext = wrapEnvConfig()
  const configFileName = wrapConfigName(configContext)
  return createConfig({
    configContext,
    configName: configFileName,
    configFileName: APP_CONSTANTS.APP_CONFIG_NAME,
  })
}
