import { viteExternalsPlugin } from 'vite-plugin-externals';

async function viteExternalPlugin() {
  return viteExternalsPlugin({
    cesium: 'Cesium',
    '@easydarwin/easyplayer': 'EasyPlayer',
  });
}

export { viteExternalPlugin };
