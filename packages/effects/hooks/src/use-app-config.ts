import type {
  ApplicationConfig,
  EngineAppConfigRaw,
} from '@aerial-engine/types/global';

/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(
  env: Record<string, any>,
  isProduction: boolean,
): ApplicationConfig {
  // 生产环境下，直接使用 window._ENGINE_APP_CONF_ 全局变量
  const config = isProduction
    ? window._ENGINE_APP_CONF_
    : (env as EngineAppConfigRaw);

  const { VITE_GLOB_API_URL } = config;

  return {
    apiURL: VITE_GLOB_API_URL,
  };
}
