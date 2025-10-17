import { copyFile } from '@engine/node-utils';

const tiandituPath = `libraries/tianditu`;
const targets = {
  files: ['cesiumTdt.js', 'bytebuffer.min.js'],
};

export const runTiandituScript = () => {
  copyFile(tiandituPath, `public/tianditu`, targets, true);
};

export default {
  runTiandituScript,
};
