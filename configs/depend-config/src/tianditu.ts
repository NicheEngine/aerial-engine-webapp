import { copyFile } from '@aerial-engine/node-utils';

const tiandituPath = `libraries/tianditu`;
const targets = {
  files: [
    'Cesium_ext_min.js',
    'protobuf.min.js',
    'bytebuffer.min.js',
    'long.min.js',
  ],
};

export const runTiandituScript = () => {
  copyFile(tiandituPath, `public/tianditu`, targets, true);
};

export default {
  runTiandituScript,
};
